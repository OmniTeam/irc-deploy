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
class PartnerSetupMilestonesController {

    PartnerSetupMilestonesService partnerSetupMilestonesService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond partnerSetupMilestonesService.list(params), model:[partnerSetupMilestonesCount: partnerSetupMilestonesService.count()]
    }

    def show(String id) {
        respond partnerSetupMilestonesService.get(id)
    }

    @Transactional
    def save(PartnerSetupMilestones partnerSetupMilestones) {
        if (partnerSetupMilestones == null) {
            render status: NOT_FOUND
            return
        }
        if (partnerSetupMilestones.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond partnerSetupMilestones.errors
            return
        }

        try {
            partnerSetupMilestonesService.save(partnerSetupMilestones)
        } catch (ValidationException e) {
            respond partnerSetupMilestones.errors
            return
        }

        respond partnerSetupMilestones, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(PartnerSetupMilestones partnerSetupMilestones) {
        if (partnerSetupMilestones == null) {
            render status: NOT_FOUND
            return
        }
        if (partnerSetupMilestones.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond partnerSetupMilestones.errors
            return
        }

        try {
            partnerSetupMilestonesService.save(partnerSetupMilestones)
        } catch (ValidationException e) {
            respond partnerSetupMilestones.errors
            return
        }

        respond partnerSetupMilestones, [status: OK, view:"show"]
    }

    @Transactional
    def delete(String id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        partnerSetupMilestonesService.delete(id)

        render status: NO_CONTENT
    }
}
