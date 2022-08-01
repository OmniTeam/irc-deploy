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
class ReferralController {

    ReferralService referralService
    TaskListService taskListService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
//        params.max = Math.min(max ?: 100, 1000)
        respond referralService.list()
    }

    def show(String id) {
        respond referralService.get(id)
    }

    @Transactional
    def save(Referral referral) {
        if (referral == null) {
            render status: NOT_FOUND
            return
        }
        if (referral.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond referral.errors
            return
        }

        try {
            referralService.save(referral)
        } catch (ValidationException e) {
            respond referral.errors
            return
        }


        respond referral, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(Referral referral) {
        if (referral == null) {
            render status: NOT_FOUND
            return
        }
        if (referral.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond referral.errors
            return
        }

        try {
            referralService.save(referral)
        } catch (ValidationException e) {
            respond referral.errors
            return
        }

        respond referral, [status: OK, view:"show"]
    }

    @Transactional
    def delete(String id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        def referral = referralService.get(id)

        def query = "SELECT process_instance_id, id FROM task_list WHERE input_variables like '%${referral.id}%'"
        def result = AppHolder.withMisSql { rows(query.toString()) }
        def tasks =  TaskList.findAllByInputVariables('%' + id + '%')
        result.each {
            def deleteFromCamunda = FeedbackController.deleteProcessInstance(it.process_instance_id)
            if(deleteFromCamunda){
                taskListService.delete(it.id)
            }
        }

        referralService.delete(id)

        render status: NO_CONTENT
    }
}
