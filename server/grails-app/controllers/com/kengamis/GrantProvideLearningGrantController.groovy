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
class GrantProvideLearningGrantController {

    GrantProvideLearningGrantService grantProvideLearningGrantService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond grantProvideLearningGrantService.list(params), model:[grantProvideLearningGrantCount: grantProvideLearningGrantService.count()]
    }

    def show(Long id) {
        respond grantProvideLearningGrantService.get(id)
    }

    @Transactional
    def save(GrantProvideLearningGrant grantProvideLearningGrant) {
        if (grantProvideLearningGrant == null) {
            render status: NOT_FOUND
            return
        }
        if (grantProvideLearningGrant.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond grantProvideLearningGrant.errors
            return
        }

        try {
            grantProvideLearningGrantService.save(grantProvideLearningGrant)
        } catch (ValidationException e) {
            respond grantProvideLearningGrant.errors
            return
        }

        respond grantProvideLearningGrant, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(GrantProvideLearningGrant grantProvideLearningGrant) {
        if (grantProvideLearningGrant == null) {
            render status: NOT_FOUND
            return
        }
        if (grantProvideLearningGrant.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond grantProvideLearningGrant.errors
            return
        }

        try {
            grantProvideLearningGrantService.save(grantProvideLearningGrant)
        } catch (ValidationException e) {
            respond grantProvideLearningGrant.errors
            return
        }

        respond grantProvideLearningGrant, [status: OK, view:"show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        grantProvideLearningGrantService.delete(id)

        render status: NO_CONTENT
    }
}
