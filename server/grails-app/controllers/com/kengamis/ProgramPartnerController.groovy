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
            newProgramPartnerObject['name'] = programPartner.name
            newProgramPartnerObject['leadCluster'] = programPartner.leadCluster
            newProgramPartnerObject['physicalAddress'] = programPartner.physicalAddress
            newProgramPartnerObject['postalAddress'] = programPartner.postalAddress
            newProgramPartnerObject['acronym'] = programPartner.acronym
            newProgramPartnerObject['email'] = programPartner.email
            newProgramPartnerObject['organisation'] = programPartner.organisation
            newProgramPartnerObject['website'] = programPartner.website
            newProgramPartnerObject['legal'] = programPartner.legal
            newProgramPartnerObject['country'] = programPartner.country
            newProgramPartnerObject['nameContactPerson'] = programPartner.nameContactPerson
            newProgramPartnerObject['city'] = programPartner.city
            newProgramPartnerObject['dateCreated'] = programPartner.dateCreated
            newProgramPartnerObject['lastUpdated'] = programPartner.lastUpdated
            newProgramPartnerObject['program'] = program.title
            newProgramPartnerObject['programId'] = program.id
            programPartners << newProgramPartnerObject
        }
        respond programPartners
    }

    def show(String id) {
        def programPartner = programPartnerService.get(id)
        def newProgramPartnerObject = [:]
        def programId = programPartner.program.id
        def program = Program.findById(programId)
        newProgramPartnerObject['id'] = programPartner.id
        newProgramPartnerObject['name'] = programPartner.name
        newProgramPartnerObject['leadCluster'] = programPartner.leadCluster
        newProgramPartnerObject['physicalAddress'] = programPartner.physicalAddress
        newProgramPartnerObject['postalAddress'] = programPartner.postalAddress
        newProgramPartnerObject['acronym'] = programPartner.acronym
        newProgramPartnerObject['email'] = programPartner.email
        newProgramPartnerObject['organisation'] = programPartner.organisation
        newProgramPartnerObject['website'] = programPartner.website
        newProgramPartnerObject['legal'] = programPartner.legal
        newProgramPartnerObject['country'] = programPartner.country
        newProgramPartnerObject['nameContactPerson'] = programPartner.nameContactPerson
        newProgramPartnerObject['city'] = programPartner.city
        newProgramPartnerObject['dateCreated'] = programPartner.dateCreated
        newProgramPartnerObject['lastUpdated'] = programPartner.lastUpdated
        newProgramPartnerObject['program'] = program.title
        newProgramPartnerObject['programId'] = program.id
        respond newProgramPartnerObject
    }

    @Transactional
    def save(ProgramPartner programPartner) {
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

        respond programPartner, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(ProgramPartner programPartner) {
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

        respond programPartner, [status: OK, view:"show"]
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
            if(!list.contains(programPartner.id)) {
                def newProgramPartnerObject = [:]
                def programId = programPartner.program.id
                def program = Program.findById(programId)
                newProgramPartnerObject['id'] = programPartner.id
                newProgramPartnerObject['name'] = programPartner.name
                newProgramPartnerObject['leadCluster'] = programPartner.leadCluster
                newProgramPartnerObject['physicalAddress'] = programPartner.physicalAddress
                newProgramPartnerObject['postalAddress'] = programPartner.postalAddress
                newProgramPartnerObject['acronym'] = programPartner.acronym
                newProgramPartnerObject['email'] = programPartner.email
                newProgramPartnerObject['organisation'] = programPartner.organisation
                newProgramPartnerObject['website'] = programPartner.website
                newProgramPartnerObject['legal'] = programPartner.legal
                newProgramPartnerObject['country'] = programPartner.country
                newProgramPartnerObject['nameContactPerson'] = programPartner.nameContactPerson
                newProgramPartnerObject['city'] = programPartner.city
                newProgramPartnerObject['dateCreated'] = programPartner.dateCreated
                newProgramPartnerObject['lastUpdated'] = programPartner.lastUpdated
                newProgramPartnerObject['program'] = program.title
                newProgramPartnerObject['programId'] = program.id
                programPartners << newProgramPartnerObject
            }
        }
        respond programPartners
    }
}
