package com.kengamis

import grails.validation.ValidationException
import static org.springframework.http.HttpStatus.CREATED
import static org.springframework.http.HttpStatus.NOT_FOUND
import static org.springframework.http.HttpStatus.NO_CONTENT
import static org.springframework.http.HttpStatus.OK

import grails.gorm.transactions.ReadOnly
import grails.gorm.transactions.Transactional

@ReadOnly
class CalendarTriggerDatesController {

    CalendarTriggerDatesService calendarTriggerDatesService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond calendarTriggerDatesService.list(params), model:[calenderTriggerDatesCount: calendarTriggerDatesService.count()]
    }

    def show(Long id) {
        respond calendarTriggerDatesService.get(id)
    }

    @Transactional
    def save(CalendarTriggerDates calenderTriggerDates) {
        if (calenderTriggerDates == null) {
            render status: NOT_FOUND
            return
        }
        if (calenderTriggerDates.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond calenderTriggerDates.errors
            return
        }

        try {
            calendarTriggerDatesService.save(calenderTriggerDates)
        } catch (ValidationException e) {
            respond calenderTriggerDates.errors
            return
        }

        respond calenderTriggerDates, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(CalendarTriggerDates calenderTriggerDates) {
        if (calenderTriggerDates == null) {
            render status: NOT_FOUND
            return
        }
        if (calenderTriggerDates.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond calenderTriggerDates.errors
            return
        }

        try {
            calendarTriggerDatesService.save(calenderTriggerDates)
        } catch (ValidationException e) {
            respond calenderTriggerDates.errors
            return
        }

        respond calenderTriggerDates, [status: OK, view:"show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        calendarTriggerDatesService.delete(id)

        render status: NO_CONTENT
    }

    def getReportingCalendarByPartnerSetupId() {
        def map = [calendar: CalendarTriggerDates.findAllByPartnerSetupId(params.setupId)]
        respond map
    }
}
