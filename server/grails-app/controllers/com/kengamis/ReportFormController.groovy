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
class ReportFormController {

    ReportFormService reportFormService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond reportFormService.list(params), model:[reportFormCount: reportFormService.count()]
    }

    def show(Long id) {
        respond reportFormService.get(id)
    }

    @Transactional
    def save(ReportForm reportForm) {
        if (reportForm == null) {
            render status: NOT_FOUND
            return
        }
        if (reportForm.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond reportForm.errors
            return
        }

        try {
            reportFormService.save(reportForm)
        } catch (ValidationException e) {
            respond reportForm.errors
            return
        }

        respond reportForm, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(ReportForm reportForm) {
        if (reportForm == null) {
            render status: NOT_FOUND
            return
        }
        if (reportForm.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond reportForm.errors
            return
        }

        try {
            reportFormService.save(reportForm)
        } catch (ValidationException e) {
            respond reportForm.errors
            return
        }

        respond reportForm, [status: OK, view:"show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        reportFormService.delete(id)

        render status: NO_CONTENT
    }
}
