package com.kengamis

import grails.gorm.transactions.Transactional
import org.codehaus.groovy.runtime.StackTraceUtils

class BootStrap {
    def dataSource
    def taskService
    CentralService centralService
    def init = { servletContext ->
        AppHolder.misDataSource = dataSource
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
        //Initial Study
        def study = Study.findByCentralId('8') ?: new Study(name: 'CRVPF', centralId: '8')
        study.save(failOnError: true, flush: true)

        // Initial User and Roles
        def superAdminRole = Role.findByAuthority('ROLE_SUPER_ADMIN') ?: new Role(authority: 'ROLE_SUPER_ADMIN')
        superAdminRole.save(failOnError: true, flush: true)
        def adminRole = Role.findByAuthority('ROLE_ADMIN') ?: new Role(authority: 'ROLE_ADMIN')
        adminRole.save(failOnError: true, flush: true)

        def superAdminUser = User.findByUsername('super') ?: new User(
                names: "Super User",
                email: "super@gmail.com",
                username: 'super',
                password: 'pass',
                enabled: true).save(failOnError: true)

        def adminUser = User.findByUsername('root') ?: new User(
                names: "Root User",
                email: "root@gmail.com",
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
                cronExpression: '0 0/40 * * * ?',
                taskClass: 'com.kengamis.tasks.DynamicJobRunner',
                extraParams: 'class:com.kengamis.tasks.CentralDataImportJob',
                startOnStartup: true
        ).save(failOnError: true, flush: true)

        TaskDef.findByName("Start Camunda Instances Job") ?: new TaskDef(
                name: 'Start Camunda Instances Job',
                description: 'Starts Camunda Instances',
                cronExpression: '0 0/60 * * * ?',
                taskClass: 'com.kengamis.tasks.DynamicJobRunner',
                extraParams: 'class:com.kengamis.tasks.StartCamundaInstancesJob',
                startOnStartup: true
        ).save(failOnError: true, flush: true)

        TaskDef.findByName("TaskList Job") ?: new TaskDef(
                name: 'TaskList Job',
                description: 'Download and Upload tasks',
                cronExpression: '0 0/5 * * * ?',
                taskClass: 'com.kengamis.tasks.DynamicJobRunner',
                extraParams: 'class:com.kengamis.tasks.TasklistSyncJob',
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
