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
class ReportFormFinancialController {

    ReportFormFinancialService reportFormFinancialService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond reportFormFinancialService.list(params), model: [reportFormFinancialCount: reportFormFinancialService.count()]
    }

    def show(String id) {
        respond reportFormFinancialService.get(id)
    }

    @Transactional
    def save(ReportFormFinancial reportFormFinancial) {
        if (reportFormFinancial == null) {
            render status: NOT_FOUND
            return
        }
        if (reportFormFinancial.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond reportFormFinancial.errors
            return
        }

        try {
            def rp = ReportFormFinancial.findAllByReportIdAndBudgetLine(reportFormFinancial.reportId, reportFormFinancial.budgetLine)
            if(rp.size()>0) {
                rp.each {
                    it.reportId = reportFormFinancial.reportId
                    it.budgetLine = reportFormFinancial.budgetLine
                    it.approvedBudget = reportFormFinancial.approvedBudget
                    it.expenseToDate = reportFormFinancial.expenseToDate
                    it.totalAdvanced = reportFormFinancial.totalAdvanced
                    it.variance = reportFormFinancial.variance
                    it.quarterExpenses = reportFormFinancial.quarterExpenses
                    it.reasonForVariance = reportFormFinancial.reasonForVariance
                    it.save(flush: true, failOnError: true)
                }
            } else {
                reportFormFinancialService.save(reportFormFinancial)
            }
        } catch (ValidationException e) {
            respond reportFormFinancial.errors
            return
        }

        respond reportFormFinancial, [status: CREATED, view: "show"]
    }

    @Transactional
    def update(ReportFormFinancial reportFormFinancial) {
        println reportFormFinancial.errors
        if (reportFormFinancial == null) {
            render status: NOT_FOUND
            return
        }
        if (reportFormFinancial.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond reportFormFinancial.errors
            return
        }

        try {
            reportFormFinancialService.save(reportFormFinancial)
        } catch (ValidationException e) {
            respond reportFormFinancial.errors
            return
        }

        respond reportFormFinancial, [status: OK, view: "show"]
    }

    @Transactional
    def delete(String id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        reportFormFinancialService.delete(id)

        render status: NO_CONTENT
    }

    def getFinancialReportByReportId(String reportId) {
        def reportFinancial = ReportFormFinancial.findAllByReportId(reportId)
        respond reportFinancial
    }
}
