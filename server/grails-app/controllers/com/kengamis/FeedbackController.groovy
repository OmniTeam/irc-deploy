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
class FeedbackController {

    FeedbackService feedbackService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond feedbackService.list(params), model:[feedbackCount: feedbackService.count()]
    }

    def show(String id) {
        respond feedbackService.get(id)
    }

    @Transactional
    def save(Feedback feedback) {
        if (feedback == null) {
            render status: NOT_FOUND
            return
        }
        if (feedback.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond feedback.errors
            return
        }

        try {
//            String preString = 'IRC-FB-'
//            feedback.serialNumber=
            feedbackService.save(feedback)
        } catch (ValidationException e) {
            respond feedback.errors
            return
        }

        respond feedback, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(Feedback feedback) {
        if (feedback == null) {
            render status: NOT_FOUND
            return
        }
        if (feedback.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond feedback.errors
            return
        }

        try {
            feedbackService.save(feedback)
        } catch (ValidationException e) {
            respond feedback.errors
            return
        }

        respond feedback, [status: OK, view:"show"]
    }

    @Transactional
    def delete(String id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        feedbackService.delete(id)

        render status: NO_CONTENT
    }
}
