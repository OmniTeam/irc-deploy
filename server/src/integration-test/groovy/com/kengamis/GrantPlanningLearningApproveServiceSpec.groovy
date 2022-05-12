package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class GrantPlanningLearningApproveServiceSpec extends Specification {

    GrantPlanningLearningApproveService grantPlanningLearningApproveService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new GrantPlanningLearningApprove(...).save(flush: true, failOnError: true)
        //new GrantPlanningLearningApprove(...).save(flush: true, failOnError: true)
        //GrantPlanningLearningApprove grantPlanningLearningApprove = new GrantPlanningLearningApprove(...).save(flush: true, failOnError: true)
        //new GrantPlanningLearningApprove(...).save(flush: true, failOnError: true)
        //new GrantPlanningLearningApprove(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //grantPlanningLearningApprove.id
    }

    void "test get"() {
        setupData()

        expect:
        grantPlanningLearningApproveService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<GrantPlanningLearningApprove> grantPlanningLearningApproveList = grantPlanningLearningApproveService.list(max: 2, offset: 2)

        then:
        grantPlanningLearningApproveList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        grantPlanningLearningApproveService.count() == 5
    }

    void "test delete"() {
        Long grantPlanningLearningApproveId = setupData()

        expect:
        grantPlanningLearningApproveService.count() == 5

        when:
        grantPlanningLearningApproveService.delete(grantPlanningLearningApproveId)
        sessionFactory.currentSession.flush()

        then:
        grantPlanningLearningApproveService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        GrantPlanningLearningApprove grantPlanningLearningApprove = new GrantPlanningLearningApprove()
        grantPlanningLearningApproveService.save(grantPlanningLearningApprove)

        then:
        grantPlanningLearningApprove.id != null
    }
}
