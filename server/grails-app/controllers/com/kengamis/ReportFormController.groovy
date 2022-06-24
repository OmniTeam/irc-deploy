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
        def reportData = [report: ReportForm.findByProcessInstanceId(params.processInstanceId)]
        respond reportData
    }

    def getMilestonePerformance() {
        def slurper = new JsonSlurper()
        def milestones = []

        ReportForm.all.each {
            def values = slurper.parseText(it.reportValues)
            def performanceReport = slurper.parseText(values['performanceReport'] as String)
            def financialReport = slurper.parseText(values['financialReport'] as String)
            if (performanceReport != null) {
                performanceReport.each { p ->
                    ProjectMilestone pm = ProjectMilestone.findById(p['milestoneId'] as String)
                    def expenseToDate = ''
                    def approvedBudget = ''
                    financialReport.each { f ->
                        if (f['budget_line'] == pm?.name) {
                            expenseToDate = f['expense_to_date']
                            approvedBudget = f['approved_budget']
                        }
                    }
                    milestones << [
                            milestoneId          : pm?.id,
                            partnerId            : it.partnerId,
                            milestone            : pm?.name,
                            overallTarget        : p['overall_target'],
                            cumulativeAchievement: p['cumulative_achievement'],
                            percentageAchievement: p['percentage_achievement'],
                            expenseToDate        : expenseToDate,
                            approvedBudget       : approvedBudget,

                    ]
                }
            }
        }
        respond milestones
    }
}
