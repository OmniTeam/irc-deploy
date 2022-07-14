package com.kengamis

import com.kengamis.tasks.StartCamundaInstancesJob
import grails.validation.ValidationException
import groovy.json.JsonSlurper
import groovyx.net.http.ContentType
import groovyx.net.http.HTTPBuilder
import groovyx.net.http.Method

import static org.springframework.http.HttpStatus.CREATED
import static org.springframework.http.HttpStatus.NOT_FOUND
import static org.springframework.http.HttpStatus.NO_CONTENT
import static org.springframework.http.HttpStatus.OK
import static org.springframework.http.HttpStatus.UNPROCESSABLE_ENTITY

import grails.gorm.transactions.ReadOnly
import grails.gorm.transactions.Transactional

@ReadOnly
class WorkPlanController {

    WorkPlanService workPlanService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        //params.max = Math.min(max ?: 10, 100)

        def list = []

        WorkPlan.all.each { workPlan ->
            def user = User.findById(workPlan.staffId)

            list << [id         : workPlan.id,
                     staff      : user?.names,
                     staffId    : workPlan.staffId,
                     lastUpdated: workPlan.lastUpdated,
                     dateCreated: workPlan.dateCreated,
                     setupValues: workPlan.setupValues,
                    organization: workPlan?.organization
            ]
        }
        respond list
    }

    def show(Long id) {
        respond workPlanService.get(id)
    }

    @Transactional
    def save(WorkPlan workPlan) {
        if (workPlan == null) {
            render status: NOT_FOUND
            return
        }
        if (workPlan.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond workPlan.errors
            return
        }

        try {
            workPlanService.save(workPlan)
        } catch (ValidationException e) {
            respond workPlan.errors
            return
        }

//        getQuarterlyCommitment(workPlan)
        getBudgetItems(workPlan)
//        getIndicators(workPlan)
        respond workPlan, [status: CREATED, view: "show"]
    }

    @Transactional
    def update(WorkPlan workPlan) {
        if (workPlan == null) {
            render status: NOT_FOUND
            return
        }
        if (workPlan.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond workPlan.errors
            return
        }

        try {
            workPlanService.save(workPlan)
        } catch (ValidationException e) {
            respond workPlan.errors
            return
        }

        respond workPlan, [status: OK, view: "show"]
    }

    @Transactional
    def delete(String id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        //delete all tasks, calendar trigger dates and reports linked to this partner
        def workPlan = workPlanService.get(params.id)
        def tasks = TaskList.findAllByInputVariablesIlike('%' + workPlan.staffId + '%')
        tasks.each {
            def deletedFromCamunda = deleteProcessInstance(it.processInstanceId)
            if (deletedFromCamunda) {
                ReportForm.findAllByTaskId(it.taskId).each { it.delete() }
                ReportFormFiles.findAllByTaskId(it.taskId).each { it.delete() }
                ReportFormRecommendations.findAllByTaskId(it.taskId).each { it.delete() }
                ReportFormComments.findAllByTaskId(it.taskId).each { it.delete() }
                it.delete()
            }
        }
        CalendarTriggerDates.findAllByWorkPlanId(workPlan.id).each { it.delete() }


        workPlanService.delete(id ?: params.id)

        render status: NO_CONTENT
    }

    def getWorkPlanRecord() {
        def map = [setup: WorkPlan.findById(params.id)]
        respond map
    }

    static boolean deleteProcessInstance(id) {
        def http = new HTTPBuilder(StartCamundaInstancesJob.camundaApiUrl + "/delete/$id")
        boolean deleted = false
        http.request(Method.POST, ContentType.JSON) { req ->
            headers.Accept = 'application/json'
            requestContentType = ContentType.JSON
            response.success = { resp, json ->
                println("Camunda :: deleteProcessInstance() True [ " + json.text + " ]")
                deleted = true
            }
            response.failure = { resp ->
                println("Camunda :: deleteProcessInstance() False [ " + resp.status + " ]")
            }
        }
        return deleted
    }

    def getQuarterlyCommitment(record) {
        def slurper = new JsonSlurper()
        def workPlanId = record.id
        def quarterlyCommit = slurper.parseText(record['setupValues'] as String)
        def quarter = quarterlyCommit['quarterlyCommitment']
        quarter.each {
            def quarterly = new QuarterlyCommitment(
                    datePeriod: it['datePeriod'],
                    workPlanId: workPlanId,
                    startDate: it['startDate'],
                    endDate: it['endDate'],
                    commitment: it['commitment'])
            quarterly.save(flush: true, failOnError: true)
        }
    }


    def getBudgetItems(record) {
        def slurper = new JsonSlurper()
        def workPlanId = record.id
        def quarterlyCommit = slurper.parseText(record['setupValues'] as String)
        def budget = quarterlyCommit['budget']
        def quarterlyBudget = budget['quarterlyBudget']
        budget.each {
            def budgetly = new WorkPLanBudget(
                    budgetLine: it['datePeriod'],
                    workPlanId: workPlanId,
                    totalSpent: it['startDate'],
                    quarterlySpendingPlan: it['endDate']

            )
            budgetly.save(flush: true, failOnError: true)
            quarterlyBudget.each { q ->
                def qB = new QuarterlyBudget(
                        workPlanBudgetId: budgetly.id,
                        workPlanId: workPlanId,
                        datePeriod: q['datePeriod'],
                        amount: q['amount']
                )
                qB.save(flush: true, failOnError: true)
            }
        }

    }

    def getIndicators(record) {
        def slurper = new JsonSlurper()
        def workPlanId = record.id
        def quarterlyCommit = slurper.parseText(record['setupValues'] as String)
        def budget = quarterlyCommit['indicators']
        def quarterlyBudget = budget['disaggregation']
        budget.each {
            def milestone = new WorkPLanMilestone(
                    name: it['name'],
                    workPlanId: workPlanId,
                    milestoneId: it['milestoneId'],
                    overallTarget: it['overallTarget']

            )
            milestone.save(flush: true, failOnError: true)
            quarterlyBudget.each { q ->
                def qB = new MilestoneDisaggregation(
                        milestoneId: milestone.id,
                        workPlanId: workPlanId,
                        datePeriod: q['datePeriod'],
                        target: q['target']
                )
                qB.save(flush: true, failOnError: true)
            }
        }

    }

}
