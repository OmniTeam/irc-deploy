package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class GrantPlanningLearningReviewServiceSpec extends Specification {

    GrantPlanningLearningReviewService grantPlanningLearningReviewService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new GrantPlanningLearningReview(...).save(flush: true, failOnError: true)
        //new GrantPlanningLearningReview(...).save(flush: true, failOnError: true)
        //GrantPlanningLearningReview grantPlanningLearningReview = new GrantPlanningLearningReview(...).save(flush: true, failOnError: true)
        //new GrantPlanningLearningReview(...).save(flush: true, failOnError: true)
        //new GrantPlanningLearningReview(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //grantPlanningLearningReview.id
    }

    void "test get"() {
        setupData()

        expect:
        grantPlanningLearningReviewService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<GrantPlanningLearningReview> grantPlanningLearningReviewList = grantPlanningLearningReviewService.list(max: 2, offset: 2)

        then:
        grantPlanningLearningReviewList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        grantPlanningLearningReviewService.count() == 5
    }

    void "test delete"() {
        Long grantPlanningLearningReviewId = setupData()

        expect:
        grantPlanningLearningReviewService.count() == 5

        when:
        grantPlanningLearningReviewService.delete(grantPlanningLearningReviewId)
        sessionFactory.currentSession.flush()

        then:
        grantPlanningLearningReviewService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        GrantPlanningLearningReview grantPlanningLearningReview = new GrantPlanningLearningReview()
        grantPlanningLearningReviewService.save(grantPlanningLearningReview)

        then:
        grantPlanningLearningReview.id != null
    }
}
