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
class PartnerSetupDisbursementPlanController {

    PartnerSetupDisbursementPlanService partnerSetupDisbursementPlanService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond partnerSetupDisbursementPlanService.list(params), model:[partnerSetupDisbursementPlanCount: partnerSetupDisbursementPlanService.count()]
    }

    def show(String id) {
        respond partnerSetupDisbursementPlanService.get(id)
    }

    @Transactional
    def save(PartnerSetupDisbursementPlan partnerSetupDisbursementPlan) {
        if (partnerSetupDisbursementPlan == null) {
            render status: NOT_FOUND
            return
        }
        if (partnerSetupDisbursementPlan.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond partnerSetupDisbursementPlan.errors
            return
        }

        try {
            partnerSetupDisbursementPlanService.save(partnerSetupDisbursementPlan)
        } catch (ValidationException e) {
            respond partnerSetupDisbursementPlan.errors
            return
        }

        respond partnerSetupDisbursementPlan, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(PartnerSetupDisbursementPlan partnerSetupDisbursementPlan) {
        if (partnerSetupDisbursementPlan == null) {
            render status: NOT_FOUND
            return
        }
        if (partnerSetupDisbursementPlan.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond partnerSetupDisbursementPlan.errors
            return
        }

        try {
            partnerSetupDisbursementPlanService.save(partnerSetupDisbursementPlan)
        } catch (ValidationException e) {
            respond partnerSetupDisbursementPlan.errors
            return
        }

        respond partnerSetupDisbursementPlan, [status: OK, view:"show"]
    }

    @Transactional
    def delete(String id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        partnerSetupDisbursementPlanService.delete(id)

        render status: NO_CONTENT
    }
}
