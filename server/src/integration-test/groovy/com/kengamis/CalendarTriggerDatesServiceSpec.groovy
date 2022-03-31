package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class CalendarTriggerDatesServiceSpec extends Specification {

    CalendarTriggerDatesService calenderTriggerDatesService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new CalendarTriggerDates(...).save(flush: true, failOnError: true)
        //new CalendarTriggerDates(...).save(flush: true, failOnError: true)
        //CalendarTriggerDates calenderTriggerDates = new CalendarTriggerDates(...).save(flush: true, failOnError: true)
        //new CalendarTriggerDates(...).save(flush: true, failOnError: true)
        //new CalendarTriggerDates(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //calenderTriggerDates.id
    }

    void "test get"() {
        setupData()

        expect:
        calenderTriggerDatesService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<CalendarTriggerDates> calenderTriggerDatesList = calenderTriggerDatesService.list(max: 2, offset: 2)

        then:
        calenderTriggerDatesList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        calenderTriggerDatesService.count() == 5
    }

    void "test delete"() {
        Long calenderTriggerDatesId = setupData()

        expect:
        calenderTriggerDatesService.count() == 5

        when:
        calenderTriggerDatesService.delete(calenderTriggerDatesId)
        sessionFactory.currentSession.flush()

        then:
        calenderTriggerDatesService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        CalendarTriggerDates calenderTriggerDates = new CalendarTriggerDates()
        calenderTriggerDatesService.save(calenderTriggerDates)

        then:
        calenderTriggerDates.id != null
    }
}
