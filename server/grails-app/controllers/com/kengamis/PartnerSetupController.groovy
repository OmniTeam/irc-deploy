package com.kengamis

import grails.validation.ValidationException
import groovy.json.JsonSlurper

import static org.springframework.http.HttpStatus.CREATED
import static org.springframework.http.HttpStatus.NOT_FOUND
import static org.springframework.http.HttpStatus.NO_CONTENT
import static org.springframework.http.HttpStatus.OK
import static org.springframework.http.HttpStatus.UNPROCESSABLE_ENTITY

import grails.gorm.transactions.ReadOnly
import grails.gorm.transactions.Transactional

@ReadOnly
class PartnerSetupController {

    PartnerSetupService partnerSetupService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        //params.max = Math.min(max ?: 10, 100)

        def partnerSetups = partnerSetupService.list(params)
        def list = []

        partnerSetups.each{PartnerSetup setup ->
            list << [id: setup.id,
                      partnerId : setup.partnerId,
                      lastUpdated : setup.lastUpdated,
                      dateCreated: setup.dateCreated]
        }
        respond list
    }

    def show(Long id) {
        respond partnerSetupService.get(id)
    }

    @Transactional
    def save(PartnerSetup partnerSetup) {
        if (partnerSetup == null) {
            render status: NOT_FOUND
            return
        }
        if (partnerSetup.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond partnerSetup.errors
            return
        }

        try {
            partnerSetupService.save(partnerSetup)
        } catch (ValidationException e) {
            respond partnerSetup.errors
            return
        }

        respond partnerSetup, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(PartnerSetup partnerSetup) {
        if (partnerSetup == null) {
            render status: NOT_FOUND
            return
        }
        if (partnerSetup.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond partnerSetup.errors
            return
        }

        try {
            partnerSetupService.save(partnerSetup)
        } catch (ValidationException e) {
            respond partnerSetup.errors
            return
        }

        respond partnerSetup, [status: OK, view:"show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        partnerSetupService.delete(id)

        render status: NO_CONTENT
    }

    def getPartnerSetupRecord() {
        def map = [setup: PartnerSetup.findById(params.id)]
        respond map
    }
}
