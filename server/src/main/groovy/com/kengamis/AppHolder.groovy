package com.kengamis

import grails.plugin.springsecurity.SpringSecurityService
import grails.util.Holders
import groovy.sql.Sql
import groovy.util.logging.Slf4j
import org.jooq.DSLContext
import org.jooq.impl.DSL
import org.springframework.beans.factory.support.AbstractBeanDefinition

import javax.sql.DataSource

@Slf4j
class AppHolder {
    private static DataSource _misDataSource

    static def <T> T bean(Class<T> c) {
        return Holders.applicationContext.getBean(c)
    }

    static def bean(String name) {
        return Holders.applicationContext.getBean(name)
    }

    static User currentUser() {
        bean(SpringSecurityService).currentUser as User
    }

    static <T> T autowire(T bean) {
        Holders.applicationContext.autowireCapableBeanFactory.autowireBeanProperties(bean, AbstractBeanDefinition.AUTOWIRE_BY_TYPE, false)
        return bean
    }

    static void closeQuietly(Sql sql) {
        try {
            if (sql==null)return
            sql.close()
        } catch (Exception e) {
            log.warn("Failed to close sql", e)
        }
    }

    static def <T> T withMisSql(@DelegatesTo(Sql) Closure<T> code) {
        def sql = new Sql(_misDataSource)
        try {
            code.delegate = sql
            return code(sql)
        } finally {
            sql.close()
        }
    }

    static def <T> T withMisSqlNonTx(@DelegatesTo(Sql) Closure<T> code) {
        def sql = getTransactionLessInstance()
        try {
            code.delegate = sql
            return code(sql)
        } finally {
            closeQuietly(sql)
        }
    }

    static def <T> T withMisJooqNonTx(@DelegatesTo(DSLContext) Closure<T> code) {
        withMisSqlNonTx {
            def jooq = DSL.using(connection)
            code.delegate = jooq
            jooq.close()
            return code(jooq)
        }
    }

    static void setMisDataSource(misDataSource) {
        _misDataSource = misDataSource
    }

    static <T> T withMysqlGeneral(String dbName,@DelegatesTo(Sql) Closure<T> code){
        def url = "jdbc:mysql://localhost:3306/$dbName?create=true&autoReconnect=true&useUnicode=true&characterEncoding=UTF8&zeroDateTimeBehavior=convertToNull"
        def sql = Sql.newInstance(url.toString(),
                "${Holders.grailsApplication.config.dataSource.username}",
                "${Holders.grailsApplication.config.dataSource.password}",
                'com.mysql.jdbc.Driver')
        try{
            code.delegate = sql
            return code(sql)
        }finally {
            sql.close()
        }
    }

    private static def getTransactionLessInstance() {
        try{
            def properties = Holders.applicationContext.dataSource.targetDataSource.targetDataSource.poolProperties
            return Sql.newInstance(properties.url,properties.username,properties.password,properties.driverClassName)
        }catch(Exception e){
            return null
        }
    }

}
