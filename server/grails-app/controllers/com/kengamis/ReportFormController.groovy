package com.kengamis

import com.kengamis.query.EntityQueryHelper
import grails.validation.ValidationException
import static org.springframework.http.HttpStatus.CREATED
import static org.springframework.http.HttpStatus.NOT_FOUND
import static org.springframework.http.HttpStatus.NO_CONTENT
import static org.springframework.http.HttpStatus.OK
import groovy.json.JsonSlurper
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
        respond reportFormService.list(params), model: [reportFormCount: reportFormService.count()]
    }

    def show(String id) {
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

        respond reportForm, [status: CREATED, view: "show"]
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

        respond reportForm, [status: OK, view: "show"]
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

    def getReportForTask() {
        def report = ReportForm.findByProcessInstanceId(params.processInstanceId)
        def reportData = [report: null]
        if (report != null) {
            def financialReport = ReportFormFinancial.findByReportId(report.id)
            def performanceReport = ReportFormPerformance.findByReportId(report.id)
            reportData = [report: [
                    id               : report.id,
                    groupId          : report.groupId,
                    processInstanceId: report.processInstanceId,
                    partnerSetupId   : report.partnerSetupId,
                    partnerId        : report.partnerId,
                    taskId           : report.taskId,
                    taskDefinitionKey: report.taskDefinitionKey,
                    userId           : report.userId,
                    reportValues     : report.reportValues,
                    status           : report.status,
                    financialReport  : financialReport,
                    performanceReport: performanceReport
            ]]
        }
        respond reportData
    }

    def getMilestonePerformance() {
        def milestones = []

        ReportForm.all.each {
            def performanceReport = ReportFormPerformance.findByReportId(it.id)
            def financialReport = ReportFormFinancial.findByReportId(it.id)
            if (performanceReport != null && financialReport != null) {
                ProjectMilestone pm = ProjectMilestone.findById(performanceReport.milestoneId)
                def expenseToDate = ''
                def approvedBudget = ''

                if (financialReport.budgetLine == pm?.name) {
                    expenseToDate = financialReport.expenseToDate
                    approvedBudget = financialReport.approvedBudget
                }

                milestones << [
                        milestoneId          : pm?.id,
                        partnerId            : it.partnerId,
                        milestone            : pm?.name,
                        overallTarget        : performanceReport.overallTarget,
                        cumulativeAchievement: performanceReport.cumulativeAchievement,
                        percentageAchievement: performanceReport.percentageAchievement,
                        expenseToDate        : expenseToDate,
                        approvedBudget       : approvedBudget,

                ]
            }
        }
        respond milestones
    }
}
