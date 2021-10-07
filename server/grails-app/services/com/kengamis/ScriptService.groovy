package com.kengamis

import grails.core.GrailsApplication
import grails.gorm.transactions.Transactional
import groovy.sql.Sql
import net.jodah.expiringmap.ExpirationPolicy
import net.jodah.expiringmap.ExpiringMap
import org.codehaus.groovy.control.CompilerConfiguration
import org.codehaus.groovy.runtime.NullObject
import org.springframework.beans.factory.InitializingBean

import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.CopyOnWriteArrayList
import java.util.concurrent.TimeUnit

import static java.util.Arrays.asList
import static java.util.Collections.EMPTY_MAP

@Transactional(readOnly = true)
class ScriptService implements InitializingBean {

    def dataSource
    ScriptContextService scriptContextService
    Map binding
    GrailsApplication grailsApplication
    private Integer defaultCacheTime = 60
    private ExpiringMap<Object, Object> cacheMap = ExpiringMap.builder()
            .variableExpiration()
            .expirationPolicy(ExpirationPolicy.CREATED)
            .build()
    private Map<String, Class> classCache = new ConcurrentHashMap<>()
    private def COMPILED_CLASSES = new CopyOnWriteArrayList<Class>()

    @Override
    void afterPropertiesSet() throws Exception {
        binding = [:];
        binding.log = log

        if (isCompileCachingEnabled()) {
            log.info("### Compile Caching is Enabled......")
        }

        if (isScriptResultCachingEnabled()) {
            log.info("### Result Caching is Enabled......")
            def configuredCacheTime = grailsApplication.config.xeno.scriptCacheTime

            if (configuredCacheTime && configuredCacheTime instanceof Integer && configuredCacheTime > 0) {
                log.info("### Setting Default Cache Time To [$configuredCacheTime] Seconds")
                this.defaultCacheTime = configuredCacheTime
            } else {
                log.error("### Failed to Read Default Cache Time Setting. Leaving It to a default of [${this.defaultCacheTime}]Seconds")
            }

        }
    }

    @Transactional(readOnly = false)
    def evaluate(String script, Map params = EMPTY_MAP) {
        try {
            evaluateImpl(script, params)
        } catch (Exception e) {
            log.error("Error while executing Script ${script}", e)
            return "Error: ${e.message}"
        }
    }

    private def evaluateImpl(String script, Map params = [:]) {
        params = [scriptContext: scriptContextService] + params

        def _doExecute = {
            def scriptClass = compileClass(script)

            Sql sql = new Sql(dataSource)
            try {
                Script scriptInstance = scriptClass.newInstance()
                scriptInstance.binding = getParamBinding([sql: sql] + params)
                scriptInstance.run()
            } finally {
                sql.close()
            }
        }
        //Only go into this block if CACHE_TIME is provided
        if (isScriptResultCachingEnabled() && params.CACHE_TIME instanceof Number) {

            //get configured time to leave
            def timeToLeave = params.remove('CACHE_TIME') as Integer

            if (timeToLeave == -1) { // never cache value == -1
                log.trace("caching for $params diabled. doing a direct call now")
                return _doExecute()
            }

            //all time below zero apart from -1 should be reset to default cache time
            if (timeToLeave <= 0) {
                timeToLeave = defaultCacheTime
            }

            Object key = generateKey(script, params);

            def result = cacheMap.get(key);

            if (result && log.isTraceEnabled()) {
                log.trace("***CACHE-HIT****: $params")
            }

            if (result && cacheMap.getExpiration(key) != TimeUnit.SECONDS.toMillis(timeToLeave)) {
                log.debug("***CACHE-TTL-RESET****:Setting new Script CacheExpiry to $timeToLeave")
                cacheMap.setExpiration(key, timeToLeave, TimeUnit.SECONDS)
            }

            if (result == null) {
                result = _doExecute()
                cacheMap.put(key, result ?: NullObject.nullObject, timeToLeave, TimeUnit.SECONDS);
            }
            return result == NullObject.nullObject ? null : result;
        }

        return _doExecute()

    }
    Class compileClass(String data, URL... urls) {
        return compileClass(data, CompilerConfiguration.DEFAULT, urls)
    }

    Class compileClass(String data, CompilerConfiguration compilerConfiguration, URL... urls) {
        def cachedClass = classCache[data]
        if (!isCompileCachingEnabled()) {
            if (cachedClass) {
                if (!data.startsWith('class:')) {
                    unloadClassLoader(cachedClass.classLoader as GroovyClassLoader)
                    COMPILED_CLASSES.remove(cachedClass)
                }
            }
            cachedClass = doCompileClass(data, compilerConfiguration, urls)
        }

        classCache[data] = cachedClass = cachedClass ?: doCompileClass(data, compilerConfiguration, urls)
        return cachedClass
    }


    private doCompileClass(String data, CompilerConfiguration compilerConfiguration, URL[] urls) {
        if (log.isTraceEnabled()) {
            log.trace("Compiling Class .... \n <<<<<<<<<<<<<<<<\n ${Util.truncateString(data, 200)} \n>>>>>>>>>>>>>>>>>>\n")
        }
        def parentLoader = this.class.classLoader
        def loader = new GroovyClassLoader(parentLoader, compilerConfiguration)
        urls?.each { loader.addURL(it) }
        Class clazz
        if (data.startsWith('file:')) {
            def f = new File(data.replaceFirst('file:', ''))
            clazz = loader.parseClass(new GroovyCodeSource(f), false)
            COMPILED_CLASSES << clazz
        } else if (data.startsWith('class:')) {
            clazz = Class.forName(data.replaceFirst('class:', ''), true, loader)
        } else if (data.startsWith('plugin:')) {
            clazz = pluginService.resolvePlugin(data.replaceFirst('plugin:', ''))
        } else {
            clazz = loader.parseClass(data)
            COMPILED_CLASSES << clazz
        }
        return clazz
    }

    def unloadClasses() {
        log.info("Unloading All Compiled Classes")
        log.info("Acquiring Lock...")
        synchronized (this) {
            log.info("Lock Acquired!!!")
            COMPILED_CLASSES.eachWithIndex { it, idx ->
                unloadClassLoader(it.classLoader as GroovyClassLoader, idx.toString())
            }
            classCache.clear()
            COMPILED_CLASSES.clear()
        }

    }

    def unloadClassLoader(GroovyClassLoader classLoader, String id = "") {
        def classes = classLoader.getLoadedClasses()
        classes.each {
            unloadFromGroovySystem(it, id)
        }
        classLoader.clearCache()
        classLoader.close()
    }

    @SuppressWarnings("GrMethodMayBeStatic")
    private def unloadFromGroovySystem(Class aClass, String id = "") {
        log.info("Unloading Class [$aClass]->$id")
        GroovySystem.metaClassRegistry.removeMetaClass(aClass)
    }

    Binding getParamBinding(Map params = [:]) {
        Binding bind = new Binding([:] + binding + params)
        params.each { key, entry ->
            bind."$key" = entry
        }
        return bind
    }
//generate a key that is converted to a string so that its easy to get hash codes
    private static Object generateKey(final Object[] args) {
        if (args == null) return Collections.emptyList();
        return asList(args)?.toString();
    }

    def registerCompiledClass(Class aClass) {
        COMPILED_CLASSES << aClass
    }

    boolean isCompileCachingEnabled() { grailsApplication.config.kenga.enableCompileCaching }

    boolean isScriptResultCachingEnabled() { grailsApplication.config.kenga.enableScriptResultCaching }

}
