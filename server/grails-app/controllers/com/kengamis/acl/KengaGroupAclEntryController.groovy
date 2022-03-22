package com.kengamis.acl

import grails.validation.ValidationException
import static org.springframework.http.HttpStatus.CREATED
import static org.springframework.http.HttpStatus.NOT_FOUND
import static org.springframework.http.HttpStatus.NO_CONTENT
import static org.springframework.http.HttpStatus.OK
import static org.springframework.http.HttpStatus.UNPROCESSABLE_ENTITY

import grails.gorm.transactions.ReadOnly
import grails.gorm.transactions.Transactional

@ReadOnly
class KengaGroupAclEntryController {

    KengaGroupAclEntryService kengaGroupAclEntryService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond kengaGroupAclEntryService.list(params), model:[kengaGroupAclEntryCount: kengaGroupAclEntryService.count()]
    }

    def show(Long id) {
        respond kengaGroupAclEntryService.get(id)
    }

    @Transactional
    def save(KengaGroupAclEntry kengaGroupAclEntry) {
        if (kengaGroupAclEntry == null) {
            render status: NOT_FOUND
            return
        }
        if (kengaGroupAclEntry.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond kengaGroupAclEntry.errors
            return
        }

        try {
            kengaGroupAclEntryService.save(kengaGroupAclEntry)
        } catch (ValidationException e) {
            respond kengaGroupAclEntry.errors
            return
        }

        respond kengaGroupAclEntry, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(KengaGroupAclEntry kengaGroupAclEntry) {
        if (kengaGroupAclEntry == null) {
            render status: NOT_FOUND
            return
        }
        if (kengaGroupAclEntry.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond kengaGroupAclEntry.errors
            return
        }

        try {
            kengaGroupAclEntryService.save(kengaGroupAclEntry)
        } catch (ValidationException e) {
            respond kengaGroupAclEntry.errors
            return
        }

        respond kengaGroupAclEntry, [status: OK, view:"show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        kengaGroupAclEntryService.delete(id)

        render status: NO_CONTENT
    }

    def saveGroupMappings(){
        def json=request.JSON
        print(json)
    }
}
