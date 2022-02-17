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
class ReportFormCommentsController {

    ReportFormCommentsService reportFormCommentsService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond reportFormCommentsService.list(params), model:[reportFormCommentsCount: reportFormCommentsService.count()]
    }

    def show(Long id) {
        respond reportFormCommentsService.get(id)
    }

    @Transactional
    def save(ReportFormComments reportFormComments) {
        print "Report Errors: ${reportFormComments.errors}"
        if (reportFormComments == null) {
            render status: NOT_FOUND
            return
        }
        if (reportFormComments.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond reportFormComments.errors
            return
        }

        try {
            reportFormCommentsService.save(reportFormComments)
        } catch (ValidationException e) {
            respond reportFormComments.errors
            return
        }

        respond reportFormComments, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(ReportFormComments reportFormComments) {
        if (reportFormComments == null) {
            render status: NOT_FOUND
            return
        }
        if (reportFormComments.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond reportFormComments.errors
            return
        }

        try {
            reportFormCommentsService.save(reportFormComments)
        } catch (ValidationException e) {
            respond reportFormComments.errors
            return
        }

        respond reportFormComments, [status: OK, view:"show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        reportFormCommentsService.delete(id)

        render status: NO_CONTENT
    }
}
