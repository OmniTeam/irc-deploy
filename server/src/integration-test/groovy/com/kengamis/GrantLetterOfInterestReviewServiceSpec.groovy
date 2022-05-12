package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class GrantLetterOfInterestReviewServiceSpec extends Specification {

    GrantLetterOfInterestReviewService grantLetterOfInterestReviewService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new GrantLetterOfInterestReview(...).save(flush: true, failOnError: true)
        //new GrantLetterOfInterestReview(...).save(flush: true, failOnError: true)
        //GrantLetterOfInterestReview grantLetterOfInterestReview = new GrantLetterOfInterestReview(...).save(flush: true, failOnError: true)
        //new GrantLetterOfInterestReview(...).save(flush: true, failOnError: true)
        //new GrantLetterOfInterestReview(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //grantLetterOfInterestReview.id
    }

    void "test get"() {
        setupData()

        expect:
        grantLetterOfInterestReviewService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<GrantLetterOfInterestReview> grantLetterOfInterestReviewList = grantLetterOfInterestReviewService.list(max: 2, offset: 2)

        then:
        grantLetterOfInterestReviewList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        grantLetterOfInterestReviewService.count() == 5
    }

    void "test delete"() {
        Long grantLetterOfInterestReviewId = setupData()

        expect:
        grantLetterOfInterestReviewService.count() == 5

        when:
        grantLetterOfInterestReviewService.delete(grantLetterOfInterestReviewId)
        sessionFactory.currentSession.flush()

        then:
        grantLetterOfInterestReviewService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        GrantLetterOfInterestReview grantLetterOfInterestReview = new GrantLetterOfInterestReview()
        grantLetterOfInterestReviewService.save(grantLetterOfInterestReview)

        then:
        grantLetterOfInterestReview.id != null
    }
}
