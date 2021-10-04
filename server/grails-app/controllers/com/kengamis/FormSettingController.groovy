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
class FormSettingController {

    FormSettingService formSettingService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond formSettingService.list(params), model:[formSettingCount: formSettingService.count()]
    }

    def show(Long id) {
        respond formSettingService.get(id)
    }

    @Transactional
    def save(FormSetting formSetting) {
        if (formSetting == null) {
            render status: NOT_FOUND
            return
        }
        if (formSetting.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond formSetting.errors
            return
        }

        try {
            formSettingService.save(formSetting)
        } catch (ValidationException e) {
            respond formSetting.errors
            return
        }

        respond formSetting, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(FormSetting formSetting) {
        if (formSetting == null) {
            render status: NOT_FOUND
            return
        }
        if (formSetting.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond formSetting.errors
            return
        }

        try {
            formSettingService.save(formSetting)
        } catch (ValidationException e) {
            respond formSetting.errors
            return
        }

        respond formSetting, [status: OK, view:"show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        formSettingService.delete(id)

        render status: NO_CONTENT
    }
}
