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
class EntityFormFieldMapController {

    EntityFormFieldMapService entityFormFieldMapService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond entityFormFieldMapService.list(params), model:[entityFormFieldMapCount: entityFormFieldMapService.count()]
    }

    def show(Long id) {
        respond entityFormFieldMapService.get(id)
    }

    @Transactional
    def save(EntityFormFieldMap entityFormFieldMap) {
        if (entityFormFieldMap == null) {
            render status: NOT_FOUND
            return
        }
        if (entityFormFieldMap.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond entityFormFieldMap.errors
            return
        }

        try {
            entityFormFieldMapService.save(entityFormFieldMap)
        } catch (ValidationException e) {
            respond entityFormFieldMap.errors
            return
        }

        respond entityFormFieldMap, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(EntityFormFieldMap entityFormFieldMap) {
        if (entityFormFieldMap == null) {
            render status: NOT_FOUND
            return
        }
        if (entityFormFieldMap.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond entityFormFieldMap.errors
            return
        }

        try {
            entityFormFieldMapService.save(entityFormFieldMap)
        } catch (ValidationException e) {
            respond entityFormFieldMap.errors
            return
        }

        respond entityFormFieldMap, [status: OK, view:"show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        entityFormFieldMapService.delete(id)

        render status: NO_CONTENT
    }
}
