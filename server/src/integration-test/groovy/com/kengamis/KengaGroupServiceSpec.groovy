package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class KengaGroupServiceSpec extends Specification {

    KengaGroupService kengaGroupService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new KengaGroup(...).save(flush: true, failOnError: true)
        //new KengaGroup(...).save(flush: true, failOnError: true)
        //KengaGroup kengaGroup = new KengaGroup(...).save(flush: true, failOnError: true)
        //new KengaGroup(...).save(flush: true, failOnError: true)
        //new KengaGroup(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //kengaGroup.id
    }

    void "test get"() {
        setupData()

        expect:
        kengaGroupService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<KengaGroup> kengaGroupList = kengaGroupService.list(max: 2, offset: 2)

        then:
        kengaGroupList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        kengaGroupService.count() == 5
    }

    void "test delete"() {
        Long kengaGroupId = setupData()

        expect:
        kengaGroupService.count() == 5

        when:
        kengaGroupService.delete(kengaGroupId)
        sessionFactory.currentSession.flush()

        then:
        kengaGroupService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        KengaGroup kengaGroup = new KengaGroup()
        kengaGroupService.save(kengaGroup)

        then:
        kengaGroup.id != null
    }
}
