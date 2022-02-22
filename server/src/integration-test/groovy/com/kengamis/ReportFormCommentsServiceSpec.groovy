package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class ReportFormCommentsServiceSpec extends Specification {

    ReportFormCommentsService reportFormCommentsService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new ReportFormComments(...).save(flush: true, failOnError: true)
        //new ReportFormComments(...).save(flush: true, failOnError: true)
        //ReportFormComments reportFormComments = new ReportFormComments(...).save(flush: true, failOnError: true)
        //new ReportFormComments(...).save(flush: true, failOnError: true)
        //new ReportFormComments(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //reportFormComments.id
    }

    void "test get"() {
        setupData()

        expect:
        reportFormCommentsService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<ReportFormComments> reportFormCommentsList = reportFormCommentsService.list(max: 2, offset: 2)

        then:
        reportFormCommentsList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        reportFormCommentsService.count() == 5
    }

    void "test delete"() {
        Long reportFormCommentsId = setupData()

        expect:
        reportFormCommentsService.count() == 5

        when:
        reportFormCommentsService.delete(reportFormCommentsId)
        sessionFactory.currentSession.flush()

        then:
        reportFormCommentsService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        ReportFormComments reportFormComments = new ReportFormComments()
        reportFormCommentsService.save(reportFormComments)

        then:
        reportFormComments.id != null
    }
}
