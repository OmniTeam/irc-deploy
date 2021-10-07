package com.kengamis

import grails.plugin.springsecurity.SpringSecurityService
import grails.util.Holders
import groovy.sql.Sql
import groovy.util.logging.Slf4j
import org.springframework.beans.factory.support.AbstractBeanDefinition

import javax.sql.DataSource

@Slf4j
class AppHolder {
    private static DataSource _ultimaDataSource

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
        def sql = new Sql(_ultimaDataSource)
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

    private static def getTransactionLessInstance() {
        try{
            def properties = Holders.applicationContext.dataSource.targetDataSource.targetDataSource.poolProperties
            return Sql.newInstance(properties.url,properties.username,properties.password,properties.driverClassName)
        }catch(Exception e){
            return null
        }
    }

}
