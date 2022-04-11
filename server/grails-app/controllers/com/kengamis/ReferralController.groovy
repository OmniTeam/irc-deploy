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

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 100, 1000)
        respond referralService.list(params), model:[referralCount: referralService.count()]
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

        boolean startIrcInstance = startProcessInstance([
                RefferalId    : referral.id,
                StartDate     : "",
                EndDate       : ""

        ])

        if(startIrcInstance){
            println("IRC PROCESS STARTED")
        }

        respond referral, [status: CREATED, view:"show"]
    }



    static boolean startProcessInstance(Map processVariables) {
        def http = new HTTPBuilder(StartCamundaInstancesJob.camundaApiUrl + "/start-instance")
        boolean toReturn = false
        http.request(Method.POST, ContentType.JSON) { req ->
            body = formatProcessVariables(processVariables, 'IRC_REFERRAL')
            headers.Accept = 'application/json'
            requestContentType = ContentType.JSON
            response.success = { resp, json ->
                println("Camunda :: startProcessInstance() True [ " + json.text + " ]")
                toReturn = true
            }
            response.failure = { resp ->
                println("Camunda :: startProcessInstance() False [ " + resp.status + " ]")
            }
        }
        return toReturn
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

        referralService.delete(id)

        render status: NO_CONTENT
    }
}
