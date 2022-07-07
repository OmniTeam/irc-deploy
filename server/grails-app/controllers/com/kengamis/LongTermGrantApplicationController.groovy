package com.kengamis

import com.kengamis.tasks.TaskListSyncJob
import grails.validation.ValidationException
import static org.springframework.http.HttpStatus.CREATED
import static org.springframework.http.HttpStatus.NOT_FOUND
import static org.springframework.http.HttpStatus.NO_CONTENT
import static org.springframework.http.HttpStatus.OK
import static org.springframework.http.HttpStatus.UNPROCESSABLE_ENTITY

import grails.gorm.transactions.ReadOnly
import grails.gorm.transactions.Transactional

@ReadOnly
class LongTermGrantApplicationController {

    LongTermGrantApplicationService longTermGrantApplicationService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond longTermGrantApplicationService.list(params), model:[longTermGrantApplicationCount: longTermGrantApplicationService.count()]
    }

    def show(String id) {
        respond longTermGrantApplicationService.get(id)
    }

    @Transactional
    def save(LongTermGrantApplication longTermGrantApplication) {
        println longTermGrantApplication.errors
        if (longTermGrantApplication == null) {
            render status: NOT_FOUND
            return
        }
        if (longTermGrantApplication.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond longTermGrantApplication.errors
            return
        }

        try {
            longTermGrantApplicationService.save(longTermGrantApplication)
        } catch (ValidationException e) {
            respond longTermGrantApplication.errors
            return
        }

        respond longTermGrantApplication, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(LongTermGrantApplication longTermGrantApplication) {
        println longTermGrantApplication.errors
        if (longTermGrantApplication == null) {
            render status: NOT_FOUND
            return
        }
        if (longTermGrantApplication.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond longTermGrantApplication.errors
            return
        }

        try {
            longTermGrantApplicationService.save(longTermGrantApplication)
        } catch (ValidationException e) {
            respond longTermGrantApplication.errors
            return
        }

        respond longTermGrantApplication, [status: OK, view:"show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        longTermGrantApplicationService.delete(id)

        render status: NO_CONTENT
    }

    def getApplicationByGrantId(String id) {
        def data = [record: LongTermGrantApplication.findByGrantId(id)]
        respond data
    }

    @Transactional
    def startLongTermGrantJob(String grantId) {
        def message = ["Failed"]
        GrantLetterOfInterest grant = GrantLetterOfInterest.findById(grantId)
        createUser(grant)
        boolean started = TaskListSyncJob.startLongTermGrant(grantId)
        if (started) {
            message = ["Started grant process instance"]
        }
        respond message
    }

    @Transactional
    def createUser(GrantLetterOfInterest g) {
        def nUser = TaskListSyncJob.createUserAccount(g.id)
    }
}
