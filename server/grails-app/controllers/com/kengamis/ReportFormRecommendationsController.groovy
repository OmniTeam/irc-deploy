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
class ReportFormRecommendationsController {

    ReportFormRecommendationsService reportFormRecommendationsService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond reportFormRecommendationsService.list(params), model:[reportFormRecommendationsCount: reportFormRecommendationsService.count()]
    }

    def show(Long id) {
        respond reportFormRecommendationsService.get(id)
    }

    @Transactional
    def save(ReportFormRecommendations reportFormRecommendations) {
        print "Report Errors: ${reportFormRecommendations.errors}"
        if (reportFormRecommendations == null) {
            render status: NOT_FOUND
            return
        }
        if (reportFormRecommendations.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond reportFormRecommendations.errors
            return
        }

        try {
            reportFormRecommendationsService.save(reportFormRecommendations)
        } catch (ValidationException e) {
            respond reportFormRecommendations.errors
            return
        }

        respond reportFormRecommendations, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(ReportFormRecommendations reportFormRecommendations) {
        if (reportFormRecommendations == null) {
            render status: NOT_FOUND
            return
        }
        if (reportFormRecommendations.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond reportFormRecommendations.errors
            return
        }

        try {
            reportFormRecommendationsService.save(reportFormRecommendations)
        } catch (ValidationException e) {
            respond reportFormRecommendations.errors
            return
        }

        respond reportFormRecommendations, [status: OK, view:"show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        reportFormRecommendationsService.delete(id)

        render status: NO_CONTENT
    }

    def getRecommendationsForTask() {
        def recommendations = [recommendations: ReportFormRecommendations.findAllByProcessInstanceId(params.processInstanceId)]
        respond recommendations
    }

    def getRecommendationById() {
        def recommendation = [recommendation: ReportFormRecommendations.findById(params.id)]
        respond recommendation
    }
}
