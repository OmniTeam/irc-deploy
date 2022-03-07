package com.kengamis

import grails.validation.ValidationException
import static org.springframework.http.HttpStatus.CREATED
import static org.springframework.http.HttpStatus.NOT_FOUND
import static org.springframework.http.HttpStatus.NO_CONTENT
import static org.springframework.http.HttpStatus.OK

import grails.gorm.transactions.ReadOnly
import grails.gorm.transactions.Transactional

@ReadOnly
class ProgramStaffController {

    ProgramStaffService programStaffService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        def programStaffs = []
        programStaffService.list(params).each { programStaff ->
            def newProgramStaffObject = [:]
            def programId = programStaff.program.id
            def program = Program.findById(programId)
            newProgramStaffObject['id'] = programStaff.id
            newProgramStaffObject['name'] = programStaff.name
            newProgramStaffObject['email'] = programStaff.email
            newProgramStaffObject['nameContactPerson'] = programStaff.nameContactPerson
            newProgramStaffObject['personContact'] = programStaff.personContact
            newProgramStaffObject['dateCreated'] = programStaff.dateCreated
            newProgramStaffObject['lastUpdated'] = programStaff.lastUpdated
            newProgramStaffObject['program'] = program.title
            newProgramStaffObject['programId'] = program.id
            programStaffs << newProgramStaffObject
        }
        respond programStaffs
    }

    def show(String id) {
        def programStaff = programStaffService.get(id)
        def newProgramStaffObject = [:]
        def programId = programStaff.program.id
        def program = Program.findById(programId)
        newProgramStaffObject['id'] = programStaff.id
        newProgramStaffObject['name'] = programStaff.name
        newProgramStaffObject['email'] = programStaff.email
        newProgramStaffObject['nameContactPerson'] = programStaff.nameContactPerson
        newProgramStaffObject['personContact'] = programStaff.personContact
        newProgramStaffObject['dateCreated'] = programStaff.dateCreated
        newProgramStaffObject['lastUpdated'] = programStaff.lastUpdated
        newProgramStaffObject['program'] = program.title
        newProgramStaffObject['programId'] = program.id
        respond newProgramStaffObject
    }

    @Transactional
    def save(ProgramStaff programStaff) {
        if (programStaff == null) {
            render status: NOT_FOUND
            return
        }
        if (programStaff.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond programStaff.errors
            return
        }

        try {
            programStaffService.save(programStaff)
        } catch (ValidationException e) {
            respond programStaff.errors
            return
        }

        respond programStaff, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(ProgramStaff programStaff) {
        if (programStaff == null) {
            render status: NOT_FOUND
            return
        }
        if (programStaff.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond programStaff.errors
            return
        }

        try {
            programStaffService.save(programStaff)
        } catch (ValidationException e) {
            respond programStaff.errors
            return
        }

        respond programStaff, [status: OK, view:"show"]
    }

    @Transactional
    def delete(String id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        programStaffService.delete(id)

        render status: NO_CONTENT
    }
}
