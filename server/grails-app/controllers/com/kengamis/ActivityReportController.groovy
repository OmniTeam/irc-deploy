package com.kengamis

import com.kengamis.AppHolder
import grails.gorm.transactions.ReadOnly
import grails.gorm.transactions.Transactional
import grails.validation.ValidationException
import groovy.json.JsonSlurper

import static org.springframework.http.HttpStatus.*

@ReadOnly
class ActivityReportController {

    ActivityReportService activityReportService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond activityReportService.list(params), model: [activityReportCount: activityReportService.count()]
    }

    def show(String id) {
        respond activityReportService.get(id)
    }

    @Transactional
    def save(ActivityReport activityReport) {
        if (activityReport == null) {
            render status: NOT_FOUND
            return
        }
        if (activityReport.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond activityReport.errors
            return
        }

        try {
            activityReportService.save(activityReport)
        } catch (ValidationException e) {
            respond activityReport.errors
            return
        }

        respond activityReport, [status: CREATED, view: "show"]
    }


    @Transactional
    def update(ActivityReport activityReport) {
        if (activityReport == null) {
            render status: NOT_FOUND
            return
        }
        if (activityReport.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond activityReport.errors
            return
        }

        try {
            activityReportService.save(activityReport)
        } catch (ValidationException e) {
            respond activityReport.errors
            return
        }

        respond activityReport, [status: OK, view: "show"]
    }

    @Transactional
    def delete(String id) {
        if (id == null && params.id == null) {
            render status: NOT_FOUND
            return
        }
        /*delete all occurrences of the deleted activity from the db*/
        def activitySetup = activityReportService.get(id)
        def tasks = TaskList.findAllByInputVariablesIlike('%' + activitySetup.id + '%')
        tasks.each {
            def deleteFromCamunda = WorkPlanController.deleteProcessInstance(it.processInstanceId)
            if(deleteFromCamunda) {
                it.delete()
            }
        }
        activityReportService.delete(id)

        render status: NO_CONTENT
    }

    def getBudgetLine() {
        def budgetLine = ''
        def id = params.budgetLineId as String

        if (id != "undefined") {
            def slurper = new JsonSlurper()
            def query = "SELECT * FROM `work_plan` WHERE setup_values LIKE '%${id}%'"
            def v = AppHolder.withMisSql { rows(query.toString()) }
            if(v.size() > 0){
                def setup = v.first()
                def variables = slurper.parseText(setup['setup_values'] as String)
                variables['budget'].each {
                    if (it.id == id) budgetLine = it.budgetLine
                }
            }
        }
        budgetLine
    }
}
