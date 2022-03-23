package com.kengamis


import grails.gorm.transactions.ReadOnly
import grails.gorm.transactions.Transactional
import grails.validation.ValidationException
import groovy.json.JsonSlurper

import static org.springframework.http.HttpStatus.*

@ReadOnly
class TaskListController {

    TaskListService taskListService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        //params.max = Math.min(max ?: 10, 100)

        def taskListMapList = taskListService.list(params)
        def tasks = []

        taskListMapList.each{TaskList task ->
            def slurper = new JsonSlurper()
            def variables = slurper.parseText(task.inputVariables)
            def startDate, partnerId, programId, endDate, groupId

            variables['data'].each {
                if(it.key=='StartDate') startDate = it.value
                if(it.key=='PartnerId') partnerId = it.value
                if(it.key=='ProgramId') programId = it.value
                if(it.key=='EndDate') endDate = it.value
                if(it.key=='GroupId') groupId = it.value
            }

            tasks << [id: task.id,
                        taskName : task.taskName,
                        startDate : startDate,
                        partnerId : partnerId,
                        programId : programId,
                        endDate : endDate,
                        groupId : groupId,
                        processInstanceId : task.processInstanceId,
                        taskDefinitionKey : task.taskDefinitionKey,
                        dateCreated: task.dateCreated,
                        status: task.status]
        }
        respond tasks
    }

    def getTaskRecord() {
        def task = TaskList.get(params.id)

        def slurper = new JsonSlurper()
        def variables = slurper.parseText(task.inputVariables)
        def startDate, partnerId, programId, endDate, groupId

        variables['data'].each {
            if(it.key=='StartDate') startDate = it.value
            if(it.key=='PartnerId') partnerId = it.value
            if(it.key=='ProgramId') programId = it.value
            if(it.key=='EndDate') endDate = it.value
            if(it.key=='GroupId') groupId = it.value
        }

        def t = [id: task.id,
                taskName : task.taskName,
                startDate : startDate,
                partnerId : partnerId,
                programId : programId,
                endDate : endDate,
                groupId : groupId,
                processInstanceId : task.processInstanceId,
                taskDefinitionKey : task.taskDefinitionKey,
                dateCreated: task.dateCreated,
                status: task.status]
        respond t
    }

    def show(Long id) {
        respond taskListService.get(id)
    }

    @Transactional
    def save(TaskList taskList) {
        if (taskList == null) {
            render status: NOT_FOUND
            return
        }
        if (taskList.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond taskList.errors
            return
        }

        try {
            taskListService.save(taskList)
        } catch (ValidationException e) {
            respond taskList.errors
            return
        }

        respond taskList, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(TaskList taskList) {
        if (taskList == null) {
            render status: NOT_FOUND
            return
        }
        if (taskList.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond taskList.errors
            return
        }

        try {
            taskListService.save(taskList)
        } catch (ValidationException e) {
            respond taskList.errors
            return
        }

        respond taskList, [status: OK, view:"show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        taskListService.delete(id)

        render status: NO_CONTENT
    }
}
