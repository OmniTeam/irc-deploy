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
class UserEntityViewFiltersController {

    UserEntityViewFiltersService userEntityViewFiltersService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond userEntityViewFiltersService.list(params), model:[userEntityViewFiltersCount: userEntityViewFiltersService.count()]
    }

    def show(Long id) {
        respond userEntityViewFiltersService.get(id)
    }

    @Transactional
    def save(UserEntityViewFilters userEntityViewFilters) {
        if (userEntityViewFilters == null) {
            render status: NOT_FOUND
            return
        }
        if (userEntityViewFilters.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond userEntityViewFilters.errors
            return
        }

        try {
            userEntityViewFiltersService.save(userEntityViewFilters)
        } catch (ValidationException e) {
            respond userEntityViewFilters.errors
            return
        }

        respond userEntityViewFilters, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(UserEntityViewFilters userEntityViewFilters) {
        if (userEntityViewFilters == null) {
            render status: NOT_FOUND
            return
        }
        if (userEntityViewFilters.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond userEntityViewFilters.errors
            return
        }

        try {
            userEntityViewFiltersService.save(userEntityViewFilters)
        } catch (ValidationException e) {
            respond userEntityViewFilters.errors
            return
        }

        respond userEntityViewFilters, [status: OK, view:"show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        userEntityViewFiltersService.delete(id)

        render status: NO_CONTENT
    }
}
