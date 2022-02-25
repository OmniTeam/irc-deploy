package com.kengamis

import grails.validation.ValidationException
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

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 100, 100)
        respond taskDefService.list(params), model:[taskDefCount: taskDefService.count()]
    }

    def show(Long id) {
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
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        taskDefService.delete(id)

        render status: NO_CONTENT
    }
}
