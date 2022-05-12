package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class GrantProvideLearningGrantServiceSpec extends Specification {

    GrantProvideLearningGrantService grantProvideLearningGrantService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new GrantProvideLearningGrant(...).save(flush: true, failOnError: true)
        //new GrantProvideLearningGrant(...).save(flush: true, failOnError: true)
        //GrantProvideLearningGrant grantProvideLearningGrant = new GrantProvideLearningGrant(...).save(flush: true, failOnError: true)
        //new GrantProvideLearningGrant(...).save(flush: true, failOnError: true)
        //new GrantProvideLearningGrant(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //grantProvideLearningGrant.id
    }

    void "test get"() {
        setupData()

        expect:
        grantProvideLearningGrantService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<GrantProvideLearningGrant> grantProvideLearningGrantList = grantProvideLearningGrantService.list(max: 2, offset: 2)

        then:
        grantProvideLearningGrantList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        grantProvideLearningGrantService.count() == 5
    }

    void "test delete"() {
        Long grantProvideLearningGrantId = setupData()

        expect:
        grantProvideLearningGrantService.count() == 5

        when:
        grantProvideLearningGrantService.delete(grantProvideLearningGrantId)
        sessionFactory.currentSession.flush()

        then:
        grantProvideLearningGrantService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        GrantProvideLearningGrant grantProvideLearningGrant = new GrantProvideLearningGrant()
        grantProvideLearningGrantService.save(grantProvideLearningGrant)

        then:
        grantProvideLearningGrant.id != null
    }
}
