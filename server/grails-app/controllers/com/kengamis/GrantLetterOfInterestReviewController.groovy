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
class GrantLetterOfInterestReviewController {

    GrantLetterOfInterestReviewService grantLetterOfInterestReviewService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond grantLetterOfInterestReviewService.list(params), model:[grantLetterOfInterestReviewCount: grantLetterOfInterestReviewService.count()]
    }

    def show(String id) {
        //the id passed here is the grantId, therefore we find by grantId not Id
        respond GrantLetterOfInterestReview.findByGrantId(id)
    }

    @Transactional
    def save(GrantLetterOfInterestReview grantLetterOfInterestReview) {
        println grantLetterOfInterestReview.errors

        if (grantLetterOfInterestReview == null) {
            render status: NOT_FOUND
            return
        }
        if (grantLetterOfInterestReview.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond grantLetterOfInterestReview.errors
            return
        }

        try {
            grantLetterOfInterestReviewService.save(grantLetterOfInterestReview)
        } catch (ValidationException e) {
            respond grantLetterOfInterestReview.errors
            return
        }

        respond grantLetterOfInterestReview, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(GrantLetterOfInterestReview grantLetterOfInterestReview) {
        if (grantLetterOfInterestReview == null) {
            render status: NOT_FOUND
            return
        }
        if (grantLetterOfInterestReview.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond grantLetterOfInterestReview.errors
            return
        }

        try {
            grantLetterOfInterestReviewService.save(grantLetterOfInterestReview)
        } catch (ValidationException e) {
            respond grantLetterOfInterestReview.errors
            return
        }

        respond grantLetterOfInterestReview, [status: OK, view:"show"]
    }

    @Transactional
    def delete(String id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        grantLetterOfInterestReviewService.delete(id)

        render status: NO_CONTENT
    }
}
