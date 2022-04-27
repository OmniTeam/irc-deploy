package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class ActivityReportServiceSpec extends Specification {

    ActivityReportService activityReportService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new ActivityReport(...).save(flush: true, failOnError: true)
        //new ActivityReport(...).save(flush: true, failOnError: true)
        //ActivityReport activityReport = new ActivityReport(...).save(flush: true, failOnError: true)
        //new ActivityReport(...).save(flush: true, failOnError: true)
        //new ActivityReport(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //activityReport.id
    }

    void "test get"() {
        setupData()

        expect:
        activityReportService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<ActivityReport> activityReportList = activityReportService.list(max: 2, offset: 2)

        then:
        activityReportList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        activityReportService.count() == 5
    }

    void "test delete"() {
        Long activityReportId = setupData()

        expect:
        activityReportService.count() == 5

        when:
        activityReportService.delete(activityReportId)
        sessionFactory.currentSession.flush()

        then:
        activityReportService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        ActivityReport activityReport = new ActivityReport()
        activityReportService.save(activityReport)

        then:
        activityReport.id != null
    }
}
