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
class QueryTableController {

    QueryTableService queryTableService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond queryTableService.list(params), model:[queryTableCount: queryTableService.count()]
    }

    def show(Long id) {
        respond queryTableService.get(id)
    }

    @Transactional
    def save(QueryTable queryTable) {
        if (queryTable == null) {
            render status: NOT_FOUND
            return
        }
        if (queryTable.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond queryTable.errors
            return
        }

        try {
            queryTableService.save(queryTable)
        } catch (ValidationException e) {
            respond queryTable.errors
            return
        }

        respond queryTable, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(QueryTable queryTable) {
        if (queryTable == null) {
            render status: NOT_FOUND
            return
        }
        if (queryTable.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond queryTable.errors
            return
        }

        try {
            queryTableService.save(queryTable)
        } catch (ValidationException e) {
            respond queryTable.errors
            return
        }

        respond queryTable, [status: OK, view:"show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        queryTableService.delete(id)

        render status: NO_CONTENT
    }
}
