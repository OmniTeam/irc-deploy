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
class GrantPlanningLearningController {

    GrantPlanningLearningService grantPlanningLearningService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond grantPlanningLearningService.list(params), model:[grantPlanningLearningCount: grantPlanningLearningService.count()]
    }

    def show(String id) {
        //the id passed here is the grantId, therefore we find by grantId not Id
        respond GrantPlanningLearning.findByGrantId(id)
    }

    @Transactional
    def save(GrantPlanningLearning grantPlanningLearning) {
        println grantPlanningLearning.errors
        if (grantPlanningLearning == null) {
            render status: NOT_FOUND
            return
        }
        if (grantPlanningLearning.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond grantPlanningLearning.errors
            return
        }

        try {
            grantPlanningLearningService.save(grantPlanningLearning)
        } catch (ValidationException e) {
            respond grantPlanningLearning.errors
            return
        }

        respond grantPlanningLearning, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(GrantPlanningLearning grantPlanningLearning) {
        println grantPlanningLearning.errors
        if (grantPlanningLearning == null) {
            render status: NOT_FOUND
            return
        }
        if (grantPlanningLearning.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond grantPlanningLearning.errors
            return
        }

        try {
            grantPlanningLearningService.save(grantPlanningLearning)
        } catch (ValidationException e) {
            respond grantPlanningLearning.errors
            return
        }

        respond grantPlanningLearning, [status: OK, view:"show"]
    }

    @Transactional
    def delete(String id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        grantPlanningLearningService.delete(id)

        render status: NO_CONTENT
    }
}
