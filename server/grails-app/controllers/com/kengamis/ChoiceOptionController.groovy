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
class ChoiceOptionController {

    ChoiceOptionService choiceOptionService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond choiceOptionService.list(params), model:[choiceOptionCount: choiceOptionService.count()]
    }

    def show(Long id) {
        respond choiceOptionService.get(id)
    }

    @Transactional
    def save(ChoiceOption choiceOption) {
        if (choiceOption == null) {
            render status: NOT_FOUND
            return
        }
        if (choiceOption.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond choiceOption.errors
            return
        }

        try {
            choiceOptionService.save(choiceOption)
        } catch (ValidationException e) {
            respond choiceOption.errors
            return
        }

        respond choiceOption, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(ChoiceOption choiceOption) {
        if (choiceOption == null) {
            render status: NOT_FOUND
            return
        }
        if (choiceOption.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond choiceOption.errors
            return
        }

        try {
            choiceOptionService.save(choiceOption)
        } catch (ValidationException e) {
            respond choiceOption.errors
            return
        }

        respond choiceOption, [status: OK, view:"show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        choiceOptionService.delete(id)

        render status: NO_CONTENT
    }
}
