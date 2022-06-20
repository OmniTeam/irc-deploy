package com.kengamis

import grails.gorm.transactions.ReadOnly
import grails.gorm.transactions.Transactional
import grails.validation.ValidationException

import static org.springframework.http.HttpStatus.*

@ReadOnly
class ProgramPartnerController {

    ProgramPartnerService programPartnerService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        def programPartners = []
        programPartnerService.list(params).each { programPartner ->
            def newProgramPartnerObject = [:]
            def programId = programPartner.program.id
            def program = Program.findById(programId)
            newProgramPartnerObject['id'] = programPartner.id
            newProgramPartnerObject['cluster'] = programPartner.cluster
            newProgramPartnerObject['organisation'] = programPartner.organisation
            newProgramPartnerObject['physicalAddress'] = programPartner.physicalAddress
            newProgramPartnerObject['organisationType'] = programPartner.organisationType
            newProgramPartnerObject['emailContactPerson'] = programPartner.emailContactPerson
            newProgramPartnerObject['nameContactPerson'] = programPartner.nameContactPerson
            newProgramPartnerObject['telephoneContactPerson'] = programPartner.telephoneContactPerson
            newProgramPartnerObject['country'] = programPartner.country
            newProgramPartnerObject['city'] = programPartner.city
            newProgramPartnerObject['dateCreated'] = programPartner.dateCreated
            newProgramPartnerObject['lastUpdated'] = programPartner.lastUpdated
            newProgramPartnerObject['dataCollector'] = programPartner.dataCollector
            newProgramPartnerObject['organisationsInvolved'] = programPartner.organisationsInvolved
            newProgramPartnerObject['areaOfOperation'] = programPartner.areaOfOperation
            newProgramPartnerObject['program'] = program.title
            newProgramPartnerObject['programId'] = program.id
            programPartners << newProgramPartnerObject
        }
        respond programPartners
    }

    def show(String id) {
        def programPartner = programPartnerService.get(id)
        def newProgramPartnerObject = [:]
        if (programPartner != null) {
            def programId = programPartner.program.id
            def program = Program.findById(programId)
            newProgramPartnerObject['id'] = programPartner.id
            newProgramPartnerObject['cluster'] = programPartner.cluster
            newProgramPartnerObject['organisation'] = programPartner.organisation
            newProgramPartnerObject['physicalAddress'] = programPartner.physicalAddress
            newProgramPartnerObject['organisationType'] = programPartner.organisationType
            newProgramPartnerObject['emailContactPerson'] = programPartner.emailContactPerson
            newProgramPartnerObject['nameContactPerson'] = programPartner.nameContactPerson
            newProgramPartnerObject['telephoneContactPerson'] = programPartner.telephoneContactPerson
            newProgramPartnerObject['country'] = programPartner.country
            newProgramPartnerObject['city'] = programPartner.city
            newProgramPartnerObject['dateCreated'] = programPartner.dateCreated
            newProgramPartnerObject['lastUpdated'] = programPartner.lastUpdated
            newProgramPartnerObject['dataCollector'] = programPartner.dataCollector
            newProgramPartnerObject['organisationsInvolved'] = programPartner.organisationsInvolved
            newProgramPartnerObject['areaOfOperation'] = programPartner.areaOfOperation
            newProgramPartnerObject['program'] = program.title
            newProgramPartnerObject['programId'] = program.id
        }
        respond newProgramPartnerObject
    }

    @Transactional
    def save(ProgramPartner programPartner) {
        println programPartner.errors
        if (programPartner == null) {
            render status: NOT_FOUND
            return
        }
        if (programPartner.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond programPartner.errors
            return
        }

        try {
            programPartnerService.save(programPartner)
        } catch (ValidationException e) {
            respond programPartner.errors
            return
        }

        respond programPartner, [status: CREATED, view: "show"]
    }

    @Transactional
    def update(ProgramPartner programPartner) {
        println programPartner.errors
        if (programPartner == null) {
            render status: NOT_FOUND
            return
        }
        if (programPartner.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond programPartner.errors
            return
        }

        try {
            programPartnerService.save(programPartner)
        } catch (ValidationException e) {
            respond programPartner.errors
            return
        }

        respond programPartner, [status: OK, view: "show"]
    }

    @Transactional
    def delete(String id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        programPartnerService.delete(id)

        render status: NO_CONTENT
    }

    def getProgramPartnersWithoutWorkPlan() {
        def programPartners = []
        def list = []

        PartnerSetup.all.each {
            list << it.partnerId
        }

        programPartnerService.list(params).each { programPartner ->
            if (!list.contains(programPartner.id)) {
                def newProgramPartnerObject = [:]
                def programId = programPartner.program.id
                def program = Program.findById(programId)
                newProgramPartnerObject['id'] = programPartner.id
                newProgramPartnerObject['cluster'] = programPartner.cluster
                newProgramPartnerObject['organisation'] = programPartner.organisation
                newProgramPartnerObject['physicalAddress'] = programPartner.physicalAddress
                newProgramPartnerObject['organisationType'] = programPartner.organisationType
                newProgramPartnerObject['emailContactPerson'] = programPartner.emailContactPerson
                newProgramPartnerObject['nameContactPerson'] = programPartner.nameContactPerson
                newProgramPartnerObject['telephoneContactPerson'] = programPartner.telephoneContactPerson
                newProgramPartnerObject['country'] = programPartner.country
                newProgramPartnerObject['city'] = programPartner.city
                newProgramPartnerObject['dateCreated'] = programPartner.dateCreated
                newProgramPartnerObject['lastUpdated'] = programPartner.lastUpdated
                newProgramPartnerObject['dataCollector'] = programPartner.dataCollector
                newProgramPartnerObject['organisationsInvolved'] = programPartner.organisationsInvolved
                newProgramPartnerObject['areaOfOperation'] = programPartner.areaOfOperation
                newProgramPartnerObject['program'] = program.title
                newProgramPartnerObject['programId'] = program.id
                programPartners << newProgramPartnerObject
            }
        }
        respond programPartners
    }

    def getDataCollector() {
        def dataCollectors = []
        def query = "SELECT user_id, role.authority FROM `user_role` INNER JOIN role ON user_role.role_id = role.id WHERE role.authority ='ROLE_DATA_COLLECTOR' AND user_id NOT IN ( SELECT data_collector FROM `program_partner` )"
        def results = AppHolder.withMisSql { rows(query as String) }
        if (results.size() > 0) {
            results.each {
                User user = User.findById(it['user_id'] as String)
                if (firstTwo(user.username) == "PR") dataCollectors << it
            }
        }
        respond dataCollectors.first()
    }

    def firstTwo(String str) {
        return str.length() < 2 ? str : str.substring(0, 2);
    }
}
