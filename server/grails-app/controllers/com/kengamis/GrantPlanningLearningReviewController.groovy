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
class GrantPlanningLearningReviewController {

    GrantPlanningLearningReviewService grantPlanningLearningReviewService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond grantPlanningLearningReviewService.list(params), model:[grantPlanningLearningReviewCount: grantPlanningLearningReviewService.count()]
    }

    def show(String id) {
        respond grantPlanningLearningReviewService.get(id)
    }

    @Transactional
    def save(GrantPlanningLearningReview grantPlanningLearningReview) {
        if (grantPlanningLearningReview == null) {
            render status: NOT_FOUND
            return
        }
        if (grantPlanningLearningReview.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond grantPlanningLearningReview.errors
            return
        }

        try {
            grantPlanningLearningReviewService.save(grantPlanningLearningReview)
        } catch (ValidationException e) {
            respond grantPlanningLearningReview.errors
            return
        }

        respond grantPlanningLearningReview, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(GrantPlanningLearningReview grantPlanningLearningReview) {
        if (grantPlanningLearningReview == null) {
            render status: NOT_FOUND
            return
        }
        if (grantPlanningLearningReview.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond grantPlanningLearningReview.errors
            return
        }

        try {
            grantPlanningLearningReviewService.save(grantPlanningLearningReview)
        } catch (ValidationException e) {
            respond grantPlanningLearningReview.errors
            return
        }

        respond grantPlanningLearningReview, [status: OK, view:"show"]
    }

    @Transactional
    def delete(String id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        grantPlanningLearningReviewService.delete(id)

        render status: NO_CONTENT
    }
}
