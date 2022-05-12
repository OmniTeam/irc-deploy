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
class GrantLetterOfInterestController {

    GrantLetterOfInterestService grantLetterOfInterestService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond grantLetterOfInterestService.list(params), model:[grantLetterOfInterestCount: grantLetterOfInterestService.count()]
    }

    def show(Long id) {
        respond grantLetterOfInterestService.get(id)
    }

    @Transactional
    def save(GrantLetterOfInterest grantLetterOfInterest) {
        if (grantLetterOfInterest == null) {
            render status: NOT_FOUND
            return
        }
        if (grantLetterOfInterest.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond grantLetterOfInterest.errors
            return
        }

        try {
            grantLetterOfInterestService.save(grantLetterOfInterest)
        } catch (ValidationException e) {
            respond grantLetterOfInterest.errors
            return
        }

        respond grantLetterOfInterest, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(GrantLetterOfInterest grantLetterOfInterest) {
        if (grantLetterOfInterest == null) {
            render status: NOT_FOUND
            return
        }
        if (grantLetterOfInterest.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond grantLetterOfInterest.errors
            return
        }

        try {
            grantLetterOfInterestService.save(grantLetterOfInterest)
        } catch (ValidationException e) {
            respond grantLetterOfInterest.errors
            return
        }

        respond grantLetterOfInterest, [status: OK, view:"show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        grantLetterOfInterestService.delete(id)

        render status: NO_CONTENT
    }
}
