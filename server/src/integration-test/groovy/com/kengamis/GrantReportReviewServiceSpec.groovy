package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class GrantReportReviewServiceSpec extends Specification {

    GrantReportReviewService grantReportReviewService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new GrantReportReview(...).save(flush: true, failOnError: true)
        //new GrantReportReview(...).save(flush: true, failOnError: true)
        //GrantReportReview grantReportReview = new GrantReportReview(...).save(flush: true, failOnError: true)
        //new GrantReportReview(...).save(flush: true, failOnError: true)
        //new GrantReportReview(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //grantReportReview.id
    }

    void "test get"() {
        setupData()

        expect:
        grantReportReviewService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<GrantReportReview> grantReportReviewList = grantReportReviewService.list(max: 2, offset: 2)

        then:
        grantReportReviewList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        grantReportReviewService.count() == 5
    }

    void "test delete"() {
        Long grantReportReviewId = setupData()

        expect:
        grantReportReviewService.count() == 5

        when:
        grantReportReviewService.delete(grantReportReviewId)
        sessionFactory.currentSession.flush()

        then:
        grantReportReviewService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        GrantReportReview grantReportReview = new GrantReportReview()
        grantReportReviewService.save(grantReportReview)

        then:
        grantReportReview.id != null
    }
}
