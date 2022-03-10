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
class ProgramController {

    ProgramService programService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond programService.list(params), model:[programCount: programService.count()]
    }

    def show(String id) {
        respond programService.get(id)
    }

    @Transactional
    def save(Program program) {
        if (program == null) {
            render status: NOT_FOUND
            return
        }
        if (program.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond program.errors
            return
        }

        try {
            programService.save(program)
        } catch (ValidationException e) {
            respond program.errors
            return
        }

        respond program, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(Program program) {
        if (program == null) {
            render status: NOT_FOUND
            return
        }
        if (program.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond program.errors
            return
        }

        try {
            programService.save(program)
        } catch (ValidationException e) {
            respond program.errors
            return
        }

        respond program, [status: OK, view:"show"]
    }

    @Transactional
    def delete(String id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        programService.delete(id)

        render status: NO_CONTENT
    }
}
