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
class KengaGroupController {

    KengaGroupService kengaGroupService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 1000, 1000)
        respond kengaGroupService.list(params), model:[kengaGroupCount: kengaGroupService.count()]
    }

    def show(String id) {
        respond kengaGroupService.get(id)
    }

    @Transactional
    def save(KengaGroup kengaGroup) {
        if (kengaGroup == null) {
            render status: NOT_FOUND
            return
        }
        if (kengaGroup.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond kengaGroup.errors
            return
        }

        try {
            kengaGroupService.save(kengaGroup)
        } catch (ValidationException e) {
            respond kengaGroup.errors
            return
        }

        respond kengaGroup, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(KengaGroup kengaGroup) {
        if (kengaGroup == null) {
            render status: NOT_FOUND
            return
        }
        if (kengaGroup.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond kengaGroup.errors
            return
        }

        try {
            kengaGroupService.save(kengaGroup)
        } catch (ValidationException e) {
            respond kengaGroup.errors
            return
        }

        respond kengaGroup, [status: OK, view:"show"]
    }

    @Transactional
    def delete(String id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        kengaGroupService.delete(id)

        render status: NO_CONTENT
    }
}
