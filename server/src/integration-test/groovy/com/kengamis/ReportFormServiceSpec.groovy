package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class ReportFormServiceSpec extends Specification {

    ReportFormService reportFormService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new ReportForm(...).save(flush: true, failOnError: true)
        //new ReportForm(...).save(flush: true, failOnError: true)
        //ReportForm reportForm = new ReportForm(...).save(flush: true, failOnError: true)
        //new ReportForm(...).save(flush: true, failOnError: true)
        //new ReportForm(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //reportForm.id
    }

    void "test get"() {
        setupData()

        expect:
        reportFormService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<ReportForm> reportFormList = reportFormService.list(max: 2, offset: 2)

        then:
        reportFormList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        reportFormService.count() == 5
    }

    void "test delete"() {
        Long reportFormId = setupData()

        expect:
        reportFormService.count() == 5

        when:
        reportFormService.delete(reportFormId)
        sessionFactory.currentSession.flush()

        then:
        reportFormService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        ReportForm reportForm = new ReportForm()
        reportFormService.save(reportForm)

        then:
        reportForm.id != null
    }
}
