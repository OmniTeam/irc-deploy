package com.kengamis

import com.kengamis.tasks.StartCamundaInstancesJob
import grails.validation.ValidationException
import groovy.json.JsonSlurper

import static org.springframework.http.HttpStatus.CREATED
import static org.springframework.http.HttpStatus.NOT_FOUND
import static org.springframework.http.HttpStatus.NO_CONTENT
import static org.springframework.http.HttpStatus.OK

import grails.gorm.transactions.ReadOnly
import grails.gorm.transactions.Transactional

@ReadOnly
class TempController {

    TempService tempService

    static responseFormats = ['json', 'xml']
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
            startLongTermGrantJob(temp)
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

    static startLongTermGrantJob(Temp temp) {
        //def r = AppHolder.withMisSql { rows(queryUserRoles.toString()) }

        try {
            // if (r.size() > 0) {

            def slurper = new JsonSlurper()
            def values = slurper.parseText(temp.jsonValue)
            println values
            /* def orgInfo = slurper.parseText(grant.organisation)
             def applicantEmail = orgInfo['email']

             def edEmail = []
             def programTeamEmail = []
             def program = Program.get(grant.program)

            r.each {
                if (it['role'] == "ROLE_ED") edEmail << it['email']
                if (it['role'] == "ROLE_PROGRAM_OFFICER" && it['group_program'] == program.title) programTeamEmail << it['email']
            }*/

            boolean started = StartCamundaInstancesJob.startProcessInstance([
                    GrantId          : values['grantId'],
                    ApplicationId    : temp.id,
                    Applicant        : "brunojay001@gmail.com",
                    ProgramTeam      : "brunojay001@gmail.com",
                    ExecutiveDirector: "brunojay001@gmail.com"
            ], "LONG_TERM_GRANT")


            if (started) {
                print "================ started grant process instance ================"
                //grant.status = 'started'
                //grant.save(flush: true, failOnError: true)
                temp.type = 'application-started'
                temp.save(flush: true, failOnError: true)
            }
            //}
        } catch (e) {
            e.printStackTrace()
        }
    }

}
