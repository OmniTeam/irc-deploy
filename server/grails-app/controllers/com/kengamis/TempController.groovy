package com.kengamis

import com.kengamis.tasks.TaskListSyncJob
import grails.gorm.transactions.ReadOnly
import grails.gorm.transactions.Transactional
import grails.validation.ValidationException

import static org.springframework.http.HttpStatus.*

@ReadOnly
class TempController {

    TempService tempService

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond tempService.list(params), model: [tempCount: tempService.count()]
    }

    def show(String id) {
        respond tempService.get(id)
    }

    @Transactional
    def save(Temp temp) {
        println temp.errors
        if (temp == null) {
            render status: NOT_FOUND
            return
        }
        if (temp.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond temp.errors
            return
        }

        try {
            tempService.save(temp)
        } catch (ValidationException e) {
            respond temp.errors
            return
        }

        respond temp, [status: CREATED, view: "show"]
    }

    @Transactional
    def update(Temp temp) {
        println temp.errors
        if (temp == null) {
            render status: NOT_FOUND
            return
        }
        if (temp.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond temp.errors
            return
        }

        try {
            tempService.save(temp)
        } catch (ValidationException e) {
            respond temp.errors
            return
        }

        respond temp, [status: OK, view: "show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        tempService.delete(id)

        render status: NO_CONTENT
    }

    def getTempRecordByValue(String value) {
        def query = "SELECT * FROM `temp` WHERE json_value LIKE '%${value}%'"
        def results = AppHolder.withMisSql { rows(query as String) }
        respond results
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
