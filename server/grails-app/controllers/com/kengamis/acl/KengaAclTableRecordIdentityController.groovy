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
class KengaAclTableRecordIdentityController {

    KengaAclTableRecordIdentityService kengaAclTableRecordIdentityService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond kengaAclTableRecordIdentityService.list(params), model:[kengaAclTableRecordIdentityCount: kengaAclTableRecordIdentityService.count()]
    }

    def show(Long id) {
        respond kengaAclTableRecordIdentityService.get(id)
    }

    @Transactional
    def save(KengaAclTableRecordIdentity kengaAclTableRecordIdentity) {
        if (kengaAclTableRecordIdentity == null) {
            render status: NOT_FOUND
            return
        }
        if (kengaAclTableRecordIdentity.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond kengaAclTableRecordIdentity.errors
            return
        }

        try {
            kengaAclTableRecordIdentityService.save(kengaAclTableRecordIdentity)
        } catch (ValidationException e) {
            respond kengaAclTableRecordIdentity.errors
            return
        }

        respond kengaAclTableRecordIdentity, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(KengaAclTableRecordIdentity kengaAclTableRecordIdentity) {
        if (kengaAclTableRecordIdentity == null) {
            render status: NOT_FOUND
            return
        }
        if (kengaAclTableRecordIdentity.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond kengaAclTableRecordIdentity.errors
            return
        }

        try {
            kengaAclTableRecordIdentityService.save(kengaAclTableRecordIdentity)
        } catch (ValidationException e) {
            respond kengaAclTableRecordIdentity.errors
            return
        }

        respond kengaAclTableRecordIdentity, [status: OK, view:"show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        kengaAclTableRecordIdentityService.delete(id)

        render status: NO_CONTENT
    }
}
