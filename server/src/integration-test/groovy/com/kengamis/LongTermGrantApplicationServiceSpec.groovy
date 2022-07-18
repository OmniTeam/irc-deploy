package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class LongTermGrantApplicationServiceSpec extends Specification {

    LongTermGrantApplicationService longTermGrantApplicationService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new LongTermGrantApplication(...).save(flush: true, failOnError: true)
        //new LongTermGrantApplication(...).save(flush: true, failOnError: true)
        //LongTermGrantApplication longTermGrantApplication = new LongTermGrantApplication(...).save(flush: true, failOnError: true)
        //new LongTermGrantApplication(...).save(flush: true, failOnError: true)
        //new LongTermGrantApplication(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //longTermGrantApplication.id
    }

    void "test get"() {
        setupData()

        expect:
        longTermGrantApplicationService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<LongTermGrantApplication> longTermGrantApplicationList = longTermGrantApplicationService.list(max: 2, offset: 2)

        then:
        longTermGrantApplicationList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        longTermGrantApplicationService.count() == 5
    }

    void "test delete"() {
        Long longTermGrantApplicationId = setupData()

        expect:
        longTermGrantApplicationService.count() == 5

        when:
        longTermGrantApplicationService.delete(longTermGrantApplicationId)
        sessionFactory.currentSession.flush()

        then:
        longTermGrantApplicationService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        LongTermGrantApplication longTermGrantApplication = new LongTermGrantApplication()
        longTermGrantApplicationService.save(longTermGrantApplication)

        then:
        longTermGrantApplication.id != null
    }
}
