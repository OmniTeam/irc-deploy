package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class GrantPlanningLearningServiceSpec extends Specification {

    GrantPlanningLearningService grantPlanningLearningService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new GrantPlanningLearning(...).save(flush: true, failOnError: true)
        //new GrantPlanningLearning(...).save(flush: true, failOnError: true)
        //GrantPlanningLearning grantPlanningLearning = new GrantPlanningLearning(...).save(flush: true, failOnError: true)
        //new GrantPlanningLearning(...).save(flush: true, failOnError: true)
        //new GrantPlanningLearning(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //grantPlanningLearning.id
    }

    void "test get"() {
        setupData()

        expect:
        grantPlanningLearningService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<GrantPlanningLearning> grantPlanningLearningList = grantPlanningLearningService.list(max: 2, offset: 2)

        then:
        grantPlanningLearningList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        grantPlanningLearningService.count() == 5
    }

    void "test delete"() {
        Long grantPlanningLearningId = setupData()

        expect:
        grantPlanningLearningService.count() == 5

        when:
        grantPlanningLearningService.delete(grantPlanningLearningId)
        sessionFactory.currentSession.flush()

        then:
        grantPlanningLearningService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        GrantPlanningLearning grantPlanningLearning = new GrantPlanningLearning()
        grantPlanningLearningService.save(grantPlanningLearning)

        then:
        grantPlanningLearning.id != null
    }
}
