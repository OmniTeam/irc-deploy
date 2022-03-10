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
class ProgramCategoryController {

    ProgramCategoryService programCategoryService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        def programCategories = []
        programCategoryService.list(params).each { programCategory ->
            def newProgramCategoryObject = [:]
            def programId = programCategory.program.id
            def program = Program.findById(programId)
            newProgramCategoryObject['id'] = programCategory.id
            newProgramCategoryObject['name'] = programCategory.name
            newProgramCategoryObject['description'] = programCategory.description
            newProgramCategoryObject['dateCreated'] = programCategory.dateCreated
            newProgramCategoryObject['lastUpdated'] = programCategory.lastUpdated
            newProgramCategoryObject['program'] = program.title
            newProgramCategoryObject['programId'] = program.id
            programCategories << newProgramCategoryObject
        }
        respond programCategories
    }

    def getCategoriesByProgram() {
        def programId = params.id as String
        def program = Program.get(programId)
        def programCategories = ProgramCategory.findAllByProgram(program).collect { [id: it.id, name: it.name]}
        respond programCategories
    }

    def show(String id) {
        def programCategory = programCategoryService.get(id)
        def newProgramCategoryObject = [:]
        def programId = programCategory.program.id
        def program = Program.findById(programId)
        newProgramCategoryObject['id'] = programCategory.id
        newProgramCategoryObject['name'] = programCategory.name
        newProgramCategoryObject['description'] = programCategory.description
        newProgramCategoryObject['dateCreated'] = programCategory.dateCreated
        newProgramCategoryObject['lastUpdated'] = programCategory.lastUpdated
        newProgramCategoryObject['program'] = program.title
        newProgramCategoryObject['programId'] = program.id
        respond newProgramCategoryObject
    }

    @Transactional
    def save(ProgramCategory programCategory) {
        if (programCategory == null) {
            render status: NOT_FOUND
            return
        }
        if (programCategory.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond programCategory.errors
            return
        }

        try {
            programCategoryService.save(programCategory)
        } catch (ValidationException e) {
            respond programCategory.errors
            return
        }

        respond programCategory, [status: CREATED, view: "show"]
    }

    @Transactional
    def update(ProgramCategory programCategory) {
        if (programCategory == null) {
            render status: NOT_FOUND
            return
        }
        if (programCategory.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond programCategory.errors
            return
        }

        try {
            programCategoryService.save(programCategory)
        } catch (ValidationException e) {
            respond programCategory.errors
            return
        }

        respond programCategory, [status: OK, view: "show"]
    }

    @Transactional
    def delete(String id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        programCategoryService.delete(id)

        render status: NO_CONTENT
    }
}
