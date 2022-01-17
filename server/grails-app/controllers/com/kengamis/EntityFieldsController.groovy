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
class EntityFieldsController {

    EntityFieldsService entityFieldsService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond entityFieldsService.list(params), model:[entityFieldsCount: entityFieldsService.count()]
    }

    def show(Long id) {
        respond entityFieldsService.get(id)
    }

    @Transactional
    def save(EntityFields entityFields) {
        if (entityFields == null) {
            render status: NOT_FOUND
            return
        }
        if (entityFields.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond entityFields.errors
            return
        }

        try {
            entityFieldsService.save(entityFields)
        } catch (ValidationException e) {
            respond entityFields.errors
            return
        }

        respond entityFields, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(EntityFields entityFields) {
        if (entityFields == null) {
            render status: NOT_FOUND
            return
        }
        if (entityFields.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond entityFields.errors
            return
        }

        try {
            entityFieldsService.save(entityFields)
        } catch (ValidationException e) {
            respond entityFields.errors
            return
        }

        respond entityFields, [status: OK, view:"show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        entityFieldsService.delete(id)

        render status: NO_CONTENT
    }
}
