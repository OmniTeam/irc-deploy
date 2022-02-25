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
class UserGroupController {

    UserGroupService userGroupService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond userGroupService.list(params), model:[userGroupCount: userGroupService.count()]
    }

    def show(Long id) {
        respond userGroupService.get(id)
    }

    @Transactional
    def save(UserGroup userGroup) {
        if (userGroup == null) {
            render status: NOT_FOUND
            return
        }
        if (userGroup.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond userGroup.errors
            return
        }

        try {
            userGroupService.save(userGroup)
        } catch (ValidationException e) {
            respond userGroup.errors
            return
        }

        respond userGroup, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(UserGroup userGroup) {
        if (userGroup == null) {
            render status: NOT_FOUND
            return
        }
        if (userGroup.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond userGroup.errors
            return
        }

        try {
            userGroupService.save(userGroup)
        } catch (ValidationException e) {
            respond userGroup.errors
            return
        }

        respond userGroup, [status: OK, view:"show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        userGroupService.delete(id)

        render status: NO_CONTENT
    }
}
