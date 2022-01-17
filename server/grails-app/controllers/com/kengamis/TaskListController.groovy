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
        params.max = Math.min(max ?: 10, 100)

        def taskListMapList = taskListService.list(params)
        def tasks = []

        taskListMapList.each{TaskList task_list ->
            def slurper = new JsonSlurper()
            def variables = slurper.parseText(task_list.outputVariables)

            def description = (variables['data'].value.toString()).replaceAll("\\[", "").replaceAll("\\]","")

            tasks << [id: task_list.id,
                    taskName : task_list.taskName,
                    description : description,
                    dateCreated: task_list.dateCreated,
                    status: task_list.status]
        }
        respond tasks
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
