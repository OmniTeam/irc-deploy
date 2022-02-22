package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class ReportFormRecommendationsServiceSpec extends Specification {

    ReportFormRecommendationsService reportFormRecommendationsService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new ReportFormRecommendations(...).save(flush: true, failOnError: true)
        //new ReportFormRecommendations(...).save(flush: true, failOnError: true)
        //ReportFormRecommendations reportFormRecommendations = new ReportFormRecommendations(...).save(flush: true, failOnError: true)
        //new ReportFormRecommendations(...).save(flush: true, failOnError: true)
        //new ReportFormRecommendations(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //reportFormRecommendations.id
    }

    void "test get"() {
        setupData()

        expect:
        reportFormRecommendationsService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<ReportFormRecommendations> reportFormRecommendationsList = reportFormRecommendationsService.list(max: 2, offset: 2)

        then:
        reportFormRecommendationsList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        reportFormRecommendationsService.count() == 5
    }

    void "test delete"() {
        Long reportFormRecommendationsId = setupData()

        expect:
        reportFormRecommendationsService.count() == 5

        when:
        reportFormRecommendationsService.delete(reportFormRecommendationsId)
        sessionFactory.currentSession.flush()

        then:
        reportFormRecommendationsService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        ReportFormRecommendations reportFormRecommendations = new ReportFormRecommendations()
        reportFormRecommendationsService.save(reportFormRecommendations)

        then:
        reportFormRecommendations.id != null
    }
}
