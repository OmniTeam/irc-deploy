package com.kengamis

import grails.plugins.quartz.JobDescriptor
import grails.validation.ValidationException
import org.quartz.JobExecutionContext

import static org.codehaus.groovy.runtime.StackTraceUtils.sanitize
import static org.codehaus.groovy.runtime.StackTraceUtils.sanitize
import static org.codehaus.groovy.runtime.StackTraceUtils.sanitize
import static org.codehaus.groovy.runtime.StackTraceUtils.sanitize
import static org.springframework.http.HttpStatus.CREATED
import static org.springframework.http.HttpStatus.NOT_FOUND
import static org.springframework.http.HttpStatus.NO_CONTENT
import static org.springframework.http.HttpStatus.OK
import static org.springframework.http.HttpStatus.UNPROCESSABLE_ENTITY

import grails.gorm.transactions.ReadOnly
import grails.gorm.transactions.Transactional

@ReadOnly
class TaskDefController {

    TaskDefService taskDefService
    def jobManagerService
    TaskService taskService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 100, 100)
        def jobs = []
        def runningJobs = []
        jobManagerService.allJobs.each { jobDetails ->
            jobDetails.value.each {job ->
               def jobDescriptor = job as JobDescriptor
               def nextFireTime = jobDescriptor.triggerDescriptors.collect { Util.fromNow(it.trigger.nextFireTime)}
               jobs << [taskName: jobDescriptor.name, nextFireTime: nextFireTime[0]]
           }
        }
        jobManagerService.runningJobs.each {job ->
            def jobExecutionContext = job as JobExecutionContext
            def taskName = jobExecutionContext.jobDetail.name
            def fireTime = Util.fromNow(jobExecutionContext.fireTime)
            runningJobs << [taskName: taskName, fireTime: fireTime]
        }
        def taskDef = taskDefService.list(params)
        def jobResponse = [taskdef: taskDef, jobs: jobs, runningJobs: runningJobs]
        respond jobResponse
    }

    def show(String id) {
        respond taskDefService.get(id)
    }

    @Transactional
    def save(TaskDef taskDef) {
        if (taskDef == null) {
            render status: NOT_FOUND
            return
        }
        if (taskDef.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond taskDef.errors
            return
        }

        try {
            taskDefService.save(taskDef)
        } catch (ValidationException e) {
            respond taskDef.errors
            return
        }

        respond taskDef, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(TaskDef taskDef) {
        if (taskDef == null) {
            render status: NOT_FOUND
            return
        }
        if (taskDef.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond taskDef.errors
            return
        }

        try {
            taskDefService.save(taskDef)
        } catch (ValidationException e) {
            respond taskDef.errors
            return
        }

        respond taskDef, [status: OK, view:"show"]
    }

    @Transactional
    def delete(String id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        taskDefService.delete(id)

        render status: NO_CONTENT
    }

    def runNow() {
        def task_name = params.taskName
        def taskDef = TaskDef.findByName(task_name)
        def message = []
        if (!taskDef) {
            message = ["Task not found"]
        }
        else {
            try {
                if (taskDef.id) {
                    taskService.runNow(taskDef)
                } else {
                    taskService.runNow(taskDef.name)
                }
            } catch (Exception x) {
                log.error("Error while execution job [${taskDef.name}]", sanitize(x))
                message = [x.message]
            }
            message = ["Executed Task: $taskDef.name"]
        }
        respond message
    }

    def scheduleTask() {
        def task_name = params.taskName
        def taskDef = TaskDef.findByName(task_name)
        def message = []
        if (!taskDef) {
            message = ["Task not found"]
        }
        else {
            try {
                taskService.scheduleTask(taskDef)
                message = ["Shecduled Task: $taskDef.name"]
            } catch (Exception x) {
                log.error(x.getMessage(), sanitize(x))
                message = [x.message]
            }
        }
        respond message
    }

    def unScheduleTask() {
        def task_name = params.taskName
        def taskDef = TaskDef.findByName(task_name)
        def message = []
        def taskName = taskDef?.name ?: params.taskName
        try {
            taskService.mayBeUnScheduleTask(taskName)
            message = ["Job stopped,Job Name:[${taskName}]"]
            log.info(message)
        } catch (Exception x) {
            message = ["Error While UnScheduling Task: ${taskName}"]
            log.error(message, sanitize(x))
        }
        respond message
    }

    def disableTask() {
        def task_name = params.taskName
        def taskDef = TaskDef.findByName(task_name)
        def message = []
        if (!taskDef) {
            message = ["Task Not Found"]
        }
        else {
            try {
                taskService.mayBeUnScheduleTask(taskDef.name)
                taskDef.startOnStartup = false
                taskDef.save(flush: true)
                message = ["Job stopped,Job Name:[${taskDef.getName()}]"]
                log.info(message)
            } catch (Exception x) {
                message = ["Error While UnScheduling Task: ${taskDef.name}"]
                log.error(message, sanitize(x))
            }
        }
        respond message
    }
}
