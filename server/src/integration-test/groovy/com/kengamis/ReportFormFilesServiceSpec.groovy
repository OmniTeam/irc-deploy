package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class ReportFormFilesServiceSpec extends Specification {

    ReportFormFilesService reportFormFilesService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new ReportFormFiles(...).save(flush: true, failOnError: true)
        //new ReportFormFiles(...).save(flush: true, failOnError: true)
        //ReportFormFiles reportFormFiles = new ReportFormFiles(...).save(flush: true, failOnError: true)
        //new ReportFormFiles(...).save(flush: true, failOnError: true)
        //new ReportFormFiles(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //reportFormFiles.id
    }

    void "test get"() {
        setupData()

        expect:
        reportFormFilesService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<ReportFormFiles> reportFormFilesList = reportFormFilesService.list(max: 2, offset: 2)

        then:
        reportFormFilesList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        reportFormFilesService.count() == 5
    }

    void "test delete"() {
        Long reportFormFilesId = setupData()

        expect:
        reportFormFilesService.count() == 5

        when:
        reportFormFilesService.delete(reportFormFilesId)
        sessionFactory.currentSession.flush()

        then:
        reportFormFilesService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        ReportFormFiles reportFormFiles = new ReportFormFiles()
        reportFormFilesService.save(reportFormFiles)

        then:
        reportFormFiles.id != null
    }
}
