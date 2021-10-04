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
class StudyController {

    StudyService studyService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond studyService.list(params), model:[studyCount: studyService.count()]
    }

    def show(Long id) {
        respond studyService.get(id)
    }

    @Transactional
    def save(Study study) {
        if (study == null) {
            render status: NOT_FOUND
            return
        }
        if (study.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond study.errors
            return
        }

        try {
            studyService.save(study)
        } catch (ValidationException e) {
            respond study.errors
            return
        }

        respond study, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(Study study) {
        if (study == null) {
            render status: NOT_FOUND
            return
        }
        if (study.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond study.errors
            return
        }

        try {
            studyService.save(study)
        } catch (ValidationException e) {
            respond study.errors
            return
        }

        respond study, [status: OK, view:"show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        studyService.delete(id)

        render status: NO_CONTENT
    }
}
