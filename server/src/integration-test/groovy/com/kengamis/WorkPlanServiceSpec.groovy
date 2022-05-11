package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class WorkPlanServiceSpec extends Specification {

    WorkPlanService workPlanService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new WorkPlan(...).save(flush: true, failOnError: true)
        //new WorkPlan(...).save(flush: true, failOnError: true)
        //WorkPlan workPlan = new WorkPlan(...).save(flush: true, failOnError: true)
        //new WorkPlan(...).save(flush: true, failOnError: true)
        //new WorkPlan(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //workPlan.id
    }

    void "test get"() {
        setupData()

        expect:
        workPlanService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<WorkPlan> workPlanList = workPlanService.list(max: 2, offset: 2)

        then:
        workPlanList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        workPlanService.count() == 5
    }

    void "test delete"() {
        Long workPlanId = setupData()

        expect:
        workPlanService.count() == 5

        when:
        workPlanService.delete(workPlanId)
        sessionFactory.currentSession.flush()

        then:
        workPlanService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        WorkPlan workPlan = new WorkPlan()
        workPlanService.save(workPlan)

        then:
        workPlan.id != null
    }
}
