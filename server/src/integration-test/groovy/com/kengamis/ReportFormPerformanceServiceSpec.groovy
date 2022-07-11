package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class ReportFormPerformanceServiceSpec extends Specification {

    ReportFormPerformanceService reportFormPerformanceService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new ReportFormPerformance(...).save(flush: true, failOnError: true)
        //new ReportFormPerformance(...).save(flush: true, failOnError: true)
        //ReportFormPerformance reportFormPerformance = new ReportFormPerformance(...).save(flush: true, failOnError: true)
        //new ReportFormPerformance(...).save(flush: true, failOnError: true)
        //new ReportFormPerformance(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //reportFormPerformance.id
    }

    void "test get"() {
        setupData()

        expect:
        reportFormPerformanceService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<ReportFormPerformance> reportFormPerformanceList = reportFormPerformanceService.list(max: 2, offset: 2)

        then:
        reportFormPerformanceList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        reportFormPerformanceService.count() == 5
    }

    void "test delete"() {
        Long reportFormPerformanceId = setupData()

        expect:
        reportFormPerformanceService.count() == 5

        when:
        reportFormPerformanceService.delete(reportFormPerformanceId)
        sessionFactory.currentSession.flush()

        then:
        reportFormPerformanceService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        ReportFormPerformance reportFormPerformance = new ReportFormPerformance()
        reportFormPerformanceService.save(reportFormPerformance)

        then:
        reportFormPerformance.id != null
    }
}
