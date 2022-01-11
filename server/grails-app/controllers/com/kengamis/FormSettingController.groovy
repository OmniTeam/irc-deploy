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
        def formSettingsData = [:]
        params.max = Math.min(max ?: 200, 200)
        params.sort = 'orderOfDisplayInTable'
        params.order = 'asc'
        def formSettings
        def formName
        if (params.formtable) {
            def form = Form.findByName(params.formtable)
            formSettings = FormSetting.findAllByForm(form, params)
            formName = form.displayName
        } else {
            formSettings = FormSetting.list(params)
            formName = ''
        }
        formSettingsData['data'] = formSettings
        formSettingsData['form_name'] = formName
        respond formSettingsData
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
