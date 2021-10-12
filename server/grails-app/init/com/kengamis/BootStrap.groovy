package com.kengamis

import grails.gorm.transactions.Transactional
import org.codehaus.groovy.runtime.StackTraceUtils

class BootStrap {
    def taskService
    CentralService centralService
    def init = { servletContext ->
        authenticateCentral()
        initData()
        initSystemDefaultJobs()
        initStartUpJobs()
    }
    def destroy = {
        taskService.shutDownAllJobs()
    }

    def authenticateCentral() {
        try {
            centralService.auth()
        }
        catch (Exception e) {
            println("Exception: " + e.getMessage())
        }
    }
    @Transactional
    def initData() {
        def superAdminRole = Role.findByAuthority('ROLE_SUPER_ADMIN') ?: new Role(authority: 'ROLE_SUPER_ADMIN')
        superAdminRole.save(failOnError: true, flush: true)
        def adminRole = Role.findByAuthority('ROLE_ADMIN') ?: new Role(authority: 'ROLE_ADMIN')
        adminRole.save(failOnError: true, flush: true)

        def superAdminUser = User.findByUsername('super') ?: new User(
                username: 'super',
                password: 'pass',
                enabled: true).save(failOnError: true)

        def adminUser = User.findByUsername('root') ?: new User(
                username: 'root',
                password: 'pass',
                enabled: true).save(failOnError: true)

        if (!superAdminUser.authorities.contains(superAdminRole)) {
            UserRole.create superAdminUser, superAdminRole
        }

        if (!adminUser.authorities.contains(adminRole)) {
            UserRole.create adminUser, adminRole
        }


        for (String url in [
                '/login/auth', '/**/js/**', '/**/css/**',
                '/**/images/**', '/**/favicon.ico']) {
            new RequestMap(url: url, configAttribute: 'permitAll').save()
        }
        new RequestMap(url: '/**', configAttribute: 'ROLE_SUPER_ADMIN,ROLE_ADMIN').save()
    }

    @Transactional
    def initSystemDefaultJobs() {
        TaskDef.findByName("Central Sync Job") ?: new TaskDef(
                name: 'Central Sync Job',
                description: 'Central Data import into MIS',
                cronExpression: '0 0/5 * * * ?',
                taskClass: 'com.kengamis.tasks.DynamicJobRunner',
                extraParams: 'class:com.kengamis.tasks.CentralDataImportJob',
                startOnStartup: true
        ).save(failOnError: true, flush: true)
    }

    def initStartUpJobs() {
        def jobs = TaskDef.findAllByStartOnStartup(true)
        for (job in jobs) {
            try {
                taskService.scheduleTask(job)
            } catch (Exception x) {
                log.error("Error Starting Up Task [$job.name]", StackTraceUtils.sanitize(x))
            }
        }
    }
}
