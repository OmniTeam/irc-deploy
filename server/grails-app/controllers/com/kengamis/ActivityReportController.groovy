package com.kengamis

import com.kengamis.tasks.StartCamundaInstancesJob
import grails.validation.ValidationException
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
class ActivityReportController {

    ActivityReportService activityReportService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond activityReportService.list(params), model:[activityReportCount: activityReportService.count()]
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

        respond activityReport, [status: CREATED, view:"show"]
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

        respond activityReport, [status: OK, view:"show"]
    }

    @Transactional
    def delete(String id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        activityReportService.delete(id)

        render status: NO_CONTENT
    }
}
