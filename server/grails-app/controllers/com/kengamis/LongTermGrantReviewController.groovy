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
class LongTermGrantReviewController {

    LongTermGrantReviewService longTermGrantReviewService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond longTermGrantReviewService.list(params), model:[longTermGrantReviewCount: longTermGrantReviewService.count()]
    }

    def show(String id) {
        respond longTermGrantReviewService.get(id)
    }

    @Transactional
    def save(LongTermGrantReview longTermGrantReview) {
        println longTermGrantReview.errors
        if (longTermGrantReview == null) {
            render status: NOT_FOUND
            return
        }
        if (longTermGrantReview.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond longTermGrantReview.errors
            return
        }

        try {
            longTermGrantReviewService.save(longTermGrantReview)
        } catch (ValidationException e) {
            respond longTermGrantReview.errors
            return
        }

        respond longTermGrantReview, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(LongTermGrantReview longTermGrantReview) {
        println longTermGrantReview.errors
        if (longTermGrantReview == null) {
            render status: NOT_FOUND
            return
        }
        if (longTermGrantReview.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond longTermGrantReview.errors
            return
        }

        try {
            longTermGrantReviewService.save(longTermGrantReview)
        } catch (ValidationException e) {
            respond longTermGrantReview.errors
            return
        }

        respond longTermGrantReview, [status: OK, view:"show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        longTermGrantReviewService.delete(id)

        render status: NO_CONTENT
    }

    def getApplicationByGrantId(String id) {
        def data = LongTermGrantReview.where{grantId == id}.list(sort: 'lastUpdated', order: 'desc')
        respond data
    }
}
