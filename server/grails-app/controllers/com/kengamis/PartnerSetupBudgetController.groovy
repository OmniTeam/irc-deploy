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
class PartnerSetupBudgetController {

    PartnerSetupBudgetService partnerSetupBudgetService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond partnerSetupBudgetService.list(params), model:[partnerSetupBudgetCount: partnerSetupBudgetService.count()]
    }

    def show(String id) {
        respond partnerSetupBudgetService.get(id)
    }

    @Transactional
    def save(PartnerSetupBudget partnerSetupBudget) {
        if (partnerSetupBudget == null) {
            render status: NOT_FOUND
            return
        }
        if (partnerSetupBudget.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond partnerSetupBudget.errors
            return
        }

        try {
            def psb = PartnerSetupBudget.findAllByPartnerSetupIdAndBudgetLine(partnerSetupBudget.partnerSetupId, partnerSetupBudget.budgetLine)
            if (psb.size() > 0) {
                psb.each {
                    it.partnerSetupId = partnerSetupBudget.partnerSetupId
                    it.budgetLine = partnerSetupBudget.budgetLine
                    it.milestoneId = partnerSetupBudget.milestoneId
                    it.approvedAmount = partnerSetupBudget.approvedAmount
                    it.totalSpent = partnerSetupBudget.totalSpent
                    it.save(flush: true, failOnError: true)
                }
            } else {
                partnerSetupBudgetService.save(partnerSetupBudget)
            }
        } catch (ValidationException e) {
            respond partnerSetupBudget.errors
            return
        }

        respond partnerSetupBudget, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(PartnerSetupBudget partnerSetupBudget) {
        if (partnerSetupBudget == null) {
            render status: NOT_FOUND
            return
        }
        if (partnerSetupBudget.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond partnerSetupBudget.errors
            return
        }

        try {
            partnerSetupBudgetService.save(partnerSetupBudget)
        } catch (ValidationException e) {
            respond partnerSetupBudget.errors
            return
        }

        respond partnerSetupBudget, [status: OK, view:"show"]
    }

    @Transactional
    def delete(String id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        partnerSetupBudgetService.delete(id)

        render status: NO_CONTENT
    }

    def getSetupBudgetByPartnerSetupId(String setupId) {
        def record = PartnerSetupBudget.findAllByPartnerSetupId(setupId)
        respond record
    }
}
