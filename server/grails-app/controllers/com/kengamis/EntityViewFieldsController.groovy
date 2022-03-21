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
class EntityViewFieldsController {

    EntityViewFieldsService entityViewFieldsService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond entityViewFieldsService.list(params), model:[entityViewFieldsCount: entityViewFieldsService.count()]
    }

    def show(Long id) {
        respond entityViewFieldsService.get(id)
    }

    @Transactional
    def save(EntityViewFields entityViewFields) {
        if (entityViewFields == null) {
            render status: NOT_FOUND
            return
        }
        if (entityViewFields.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond entityViewFields.errors
            return
        }

        try {
            entityViewFieldsService.save(entityViewFields)
        } catch (ValidationException e) {
            respond entityViewFields.errors
            return
        }

        respond entityViewFields, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(EntityViewFields entityViewFields) {
        if (entityViewFields == null) {
            render status: NOT_FOUND
            return
        }
        if (entityViewFields.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond entityViewFields.errors
            return
        }

        try {
            entityViewFieldsService.save(entityViewFields)
        } catch (ValidationException e) {
            respond entityViewFields.errors
            return
        }

        respond entityViewFields, [status: OK, view:"show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        entityViewFieldsService.delete(id)

        render status: NO_CONTENT
    }
}
