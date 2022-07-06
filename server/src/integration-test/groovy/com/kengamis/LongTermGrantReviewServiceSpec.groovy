package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class LongTermGrantReviewServiceSpec extends Specification {

    LongTermGrantReviewService longTermGrantReviewService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new LongTermGrantReview(...).save(flush: true, failOnError: true)
        //new LongTermGrantReview(...).save(flush: true, failOnError: true)
        //LongTermGrantReview longTermGrantReview = new LongTermGrantReview(...).save(flush: true, failOnError: true)
        //new LongTermGrantReview(...).save(flush: true, failOnError: true)
        //new LongTermGrantReview(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //longTermGrantReview.id
    }

    void "test get"() {
        setupData()

        expect:
        longTermGrantReviewService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<LongTermGrantReview> longTermGrantReviewList = longTermGrantReviewService.list(max: 2, offset: 2)

        then:
        longTermGrantReviewList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        longTermGrantReviewService.count() == 5
    }

    void "test delete"() {
        Long longTermGrantReviewId = setupData()

        expect:
        longTermGrantReviewService.count() == 5

        when:
        longTermGrantReviewService.delete(longTermGrantReviewId)
        sessionFactory.currentSession.flush()

        then:
        longTermGrantReviewService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        LongTermGrantReview longTermGrantReview = new LongTermGrantReview()
        longTermGrantReviewService.save(longTermGrantReview)

        then:
        longTermGrantReview.id != null
    }
}
