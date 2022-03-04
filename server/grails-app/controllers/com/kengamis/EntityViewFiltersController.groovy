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
class EntityViewFiltersController {

    EntityViewFiltersService entityViewFiltersService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond entityViewFiltersService.list(params), model:[entityViewFiltersCount: entityViewFiltersService.count()]
    }

    def show(String id) {
        respond entityViewFiltersService.get(id)
    }

    @Transactional
    def save(EntityViewFilters entityViewFilters) {
        if (entityViewFilters == null) {
            render status: NOT_FOUND
            return
        }
        if (entityViewFilters.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond entityViewFilters.errors
            return
        }

        try {
            entityViewFiltersService.save(entityViewFilters)
        } catch (ValidationException e) {
            respond entityViewFilters.errors
            return
        }

        respond entityViewFilters, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(EntityViewFilters entityViewFilters) {
        if (entityViewFilters == null) {
            render status: NOT_FOUND
            return
        }
        if (entityViewFilters.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond entityViewFilters.errors
            return
        }

        try {
            entityViewFiltersService.save(entityViewFilters)
        } catch (ValidationException e) {
            respond entityViewFilters.errors
            return
        }

        respond entityViewFilters, [status: OK, view:"show"]
    }

    @Transactional
    def delete(String id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        entityViewFiltersService.delete(id)

        render status: NO_CONTENT
    }
}
