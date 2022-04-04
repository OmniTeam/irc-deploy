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
class UserPartnerController {

    UserPartnerService userPartnerService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond userPartnerService.list(params), model:[userPartnerCount: userPartnerService.count()]
    }

    def show(Long id) {
        respond userPartnerService.get(id)
    }

    @Transactional
    def save(UserPartner userPartner) {
        if (userPartner == null) {
            render status: NOT_FOUND
            return
        }
        if (userPartner.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond userPartner.errors
            return
        }

        try {
            userPartnerService.save(userPartner)
        } catch (ValidationException e) {
            respond userPartner.errors
            return
        }

        respond userPartner, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(UserPartner userPartner) {
        if (userPartner == null) {
            render status: NOT_FOUND
            return
        }
        if (userPartner.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond userPartner.errors
            return
        }

        try {
            userPartnerService.save(userPartner)
        } catch (ValidationException e) {
            respond userPartner.errors
            return
        }

        respond userPartner, [status: OK, view:"show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        userPartnerService.delete(id)

        render status: NO_CONTENT
    }
}
