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
class DataViewController {

    DataViewService dataViewService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond dataViewService.list(params), model:[dataViewCount: dataViewService.count()]
    }

    def show(String id) {
        respond dataViewService.get(id)
    }

    @Transactional
    def save(DataView dataView) {
        if (dataView == null) {
            render status: NOT_FOUND
            return
        }
        if (dataView.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond dataView.errors
            return
        }

        try {
            dataViewService.save(dataView)
        } catch (ValidationException e) {
            respond dataView.errors
            return
        }

        respond dataView, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(DataView dataView) {
        if (dataView == null) {
            render status: NOT_FOUND
            return
        }
        if (dataView.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond dataView.errors
            return
        }

        try {
            dataViewService.save(dataView)
        } catch (ValidationException e) {
            respond dataView.errors
            return
        }

        respond dataView, [status: OK, view:"show"]
    }

    @Transactional
    def delete(String id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        dataViewService.delete(id)

        render status: NO_CONTENT
    }
}
