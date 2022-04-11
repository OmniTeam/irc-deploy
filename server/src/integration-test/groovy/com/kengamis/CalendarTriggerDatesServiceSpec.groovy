package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class CalendarTriggerDatesServiceSpec extends Specification {

    CalendarTriggerDatesService calendarTriggerDatesService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new CalendarTriggerDates(...).save(flush: true, failOnError: true)
        //new CalendarTriggerDates(...).save(flush: true, failOnError: true)
        //CalendarTriggerDates calendarTriggerDates = new CalendarTriggerDates(...).save(flush: true, failOnError: true)
        //new CalendarTriggerDates(...).save(flush: true, failOnError: true)
        //new CalendarTriggerDates(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //calendarTriggerDates.id
    }

    void "test get"() {
        setupData()

        expect:
        calendarTriggerDatesService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<CalendarTriggerDates> calendarTriggerDatesList = calendarTriggerDatesService.list(max: 2, offset: 2)

        then:
        calendarTriggerDatesList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        calendarTriggerDatesService.count() == 5
    }

    void "test delete"() {
        Long calendarTriggerDatesId = setupData()

        expect:
        calendarTriggerDatesService.count() == 5

        when:
        calendarTriggerDatesService.delete(calendarTriggerDatesId)
        sessionFactory.currentSession.flush()

        then:
        calendarTriggerDatesService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        CalendarTriggerDates calendarTriggerDates = new CalendarTriggerDates()
        calendarTriggerDatesService.save(calendarTriggerDates)

        then:
        calendarTriggerDates.id != null
    }
}
