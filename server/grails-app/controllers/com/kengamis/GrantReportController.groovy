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
class GrantReportController {

    GrantReportService grantReportService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond grantReportService.list(params), model:[grantReportCount: grantReportService.count()]
    }

    def show(String id) {
        //the id passed here is the grantId, therefore we find by grantId not Id
        respond GrantReport.findByGrantId(id)
    }

    @Transactional
    def save(GrantReport grantReport) {
        println grantReport.errors
        if (grantReport == null) {
            render status: NOT_FOUND
            return
        }
        if (grantReport.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond grantReport.errors
            return
        }

        try {
            grantReportService.save(grantReport)
        } catch (ValidationException e) {
            respond grantReport.errors
            return
        }

        respond grantReport, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(GrantReport grantReport) {
        if (grantReport == null) {
            render status: NOT_FOUND
            return
        }
        if (grantReport.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond grantReport.errors
            return
        }

        try {
            grantReportService.save(grantReport)
        } catch (ValidationException e) {
            respond grantReport.errors
            return
        }

        respond grantReport, [status: OK, view:"show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        grantReportService.delete(id)

        render status: NO_CONTENT
    }
}
