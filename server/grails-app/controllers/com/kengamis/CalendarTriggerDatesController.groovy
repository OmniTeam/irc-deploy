package com.kengamis

import grails.validation.ValidationException
import org.jooq.Transaction

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
//        print calenderTriggerDates.errors
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
    def delete(String id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        CalendarTriggerDates.findAllByWorkPlanId(id).each {it.delete()}

        render status: NO_CONTENT
    }

    @Transactional
    def updateReportingCalendarStatus() {
        def setupId = params.setupId as String
        def completedStatus = params.completed=="yes"
        def calendar = CalendarTriggerDates.findByWorkPlanId(setupId)
        calendar.completed = completedStatus
        calendar.save(flush:true)
    }

    def getReportingCalendarByWorkPlanId() {
        def query = "select id, period, start_date as startDate, end_date as endDate " +
                "from calendar_trigger_dates where work_plan_id='${params.setupId}' order by period"
        def results = AppHolder.withMisSql { rows(query.toString()) }
        def map = [calendar: results]
        respond map
    }
}
