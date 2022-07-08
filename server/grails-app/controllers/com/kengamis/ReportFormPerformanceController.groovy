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
class ReportFormPerformanceController {

    ReportFormPerformanceService reportFormPerformanceService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond reportFormPerformanceService.list(params), model:[reportFormPerformanceCount: reportFormPerformanceService.count()]
    }

    def show(String id) {
        respond reportFormPerformanceService.get(id)
    }

    @Transactional
    def save(ReportFormPerformance reportFormPerformance) {
        println reportFormPerformance.errors
        if (reportFormPerformance == null) {
            render status: NOT_FOUND
            return
        }
        if (reportFormPerformance.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond reportFormPerformance.errors
            return
        }

        try {
            reportFormPerformanceService.save(reportFormPerformance)
        } catch (ValidationException e) {
            respond reportFormPerformance.errors
            return
        }

        respond reportFormPerformance, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(ReportFormPerformance reportFormPerformance) {
        println reportFormPerformance.errors
        if (reportFormPerformance == null) {
            render status: NOT_FOUND
            return
        }
        if (reportFormPerformance.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond reportFormPerformance.errors
            return
        }

        try {
            reportFormPerformanceService.save(reportFormPerformance)
        } catch (ValidationException e) {
            respond reportFormPerformance.errors
            return
        }

        respond reportFormPerformance, [status: OK, view:"show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        reportFormPerformanceService.delete(id)

        render status: NO_CONTENT
    }

    def getPerformanceReportByReportId(reportId){
        def data = [report: ReportFormPerformance.findByReportId(reportId)]
        respond data
    }
}
