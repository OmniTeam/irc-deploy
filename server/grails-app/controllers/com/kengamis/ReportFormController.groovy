package com.kengamis


import grails.gorm.transactions.ReadOnly
import grails.gorm.transactions.Transactional
import grails.validation.ValidationException
import groovy.json.JsonSlurper

import static org.springframework.http.HttpStatus.*

@ReadOnly
class ReportFormController {

    ReportFormService reportFormService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
//        params.max = Math.min(max ?: 10, 100)
        def slurper = new JsonSlurper()
        def list = []
        reportFormService.list(params).collect {
            def task = TaskList.get(it.taskId)
            if (task != null) {
                def inputVariables = task.inputVariables
                def variables = slurper.parseText(inputVariables)
                def programId = '', periodType = ''
                variables['data'].each {
                    if (it.key == 'ProgramId') programId = it.value
                    if (it.key == 'Period') periodType = it.value
                }
                def program = Program.get(programId)

                list << [
                        id               : it.id,
                        taskId           : it.taskId,
                        taskDefinitionKey: it.taskDefinitionKey,
                        process          : task.processDefKey,
                        program          : program.title,
                        periodType       : periodType,
                        dateCreated      : it.dateCreated,
                        lastUpdated      : it.lastUpdated,
                        status           : it.status
                ]
            } else {
                list << [
                        id               : it.id,
                        taskDefinitionKey: it.taskDefinitionKey,
                        program          : '',
                        periodType       : '',
                        dateCreated      : it.dateCreated,
                        lastUpdated      : it.lastUpdated,
                        status           : it.status
                ]
            }
        }

        respond list, model: [reportFormCount: reportFormService.count()]
    }

    def show(Long id) {
        respond reportFormService.get(id)
    }

    @Transactional
    def save(ReportForm reportForm) {
        print "Report Errors: ${reportForm.errors}"
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
        print "Report Errors: ${reportForm.errors}"
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
                        if (f['budget_line'] == pm.name) {
                            expenseToDate = f['expense_to_date']
                            approvedBudget = f['approved_budget']

                        }
                    }
                    milestones << [
                            milestoneId          : pm?.id,
                            staffId              : it.userId,
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

    def getActivityReportRecord() {
        def milestone = params.milestone as String
        def startDate = params.startDate as String
        def endDate = params.endDate as String
        def query = "SELECT id, milestone, cost_associated FROM `activity_report` where milestone = '${milestone}' and start_date >= '${startDate}' AND end_date <= '${endDate}'"
        def list = AppHolder.withMisSql { rows(query.toString()) }
        respond list
    }
}
