package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class ReportFormFinancialServiceSpec extends Specification {

    ReportFormFinancialService reportFormFinancialService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new ReportFormFinancial(...).save(flush: true, failOnError: true)
        //new ReportFormFinancial(...).save(flush: true, failOnError: true)
        //ReportFormFinancial reportFormFinancial = new ReportFormFinancial(...).save(flush: true, failOnError: true)
        //new ReportFormFinancial(...).save(flush: true, failOnError: true)
        //new ReportFormFinancial(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //reportFormFinancial.id
    }

    void "test get"() {
        setupData()

        expect:
        reportFormFinancialService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<ReportFormFinancial> reportFormFinancialList = reportFormFinancialService.list(max: 2, offset: 2)

        then:
        reportFormFinancialList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        reportFormFinancialService.count() == 5
    }

    void "test delete"() {
        Long reportFormFinancialId = setupData()

        expect:
        reportFormFinancialService.count() == 5

        when:
        reportFormFinancialService.delete(reportFormFinancialId)
        sessionFactory.currentSession.flush()

        then:
        reportFormFinancialService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        ReportFormFinancial reportFormFinancial = new ReportFormFinancial()
        reportFormFinancialService.save(reportFormFinancial)

        then:
        reportFormFinancial.id != null
    }
}
