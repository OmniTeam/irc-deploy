package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class KengaUserGroupServiceSpec extends Specification {

    KengaUserGroupService kengaUserGroupService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new KengaUserGroup(...).save(flush: true, failOnError: true)
        //new KengaUserGroup(...).save(flush: true, failOnError: true)
        //KengaUserGroup kengaUserGroup = new KengaUserGroup(...).save(flush: true, failOnError: true)
        //new KengaUserGroup(...).save(flush: true, failOnError: true)
        //new KengaUserGroup(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //kengaUserGroup.id
    }

    void "test get"() {
        setupData()

        expect:
        kengaUserGroupService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<KengaUserGroup> kengaUserGroupList = kengaUserGroupService.list(max: 2, offset: 2)

        then:
        kengaUserGroupList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        kengaUserGroupService.count() == 5
    }

    void "test delete"() {
        Long kengaUserGroupId = setupData()

        expect:
        kengaUserGroupService.count() == 5

        when:
        kengaUserGroupService.delete(kengaUserGroupId)
        sessionFactory.currentSession.flush()

        then:
        kengaUserGroupService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        KengaUserGroup kengaUserGroup = new KengaUserGroup()
        kengaUserGroupService.save(kengaUserGroup)

        then:
        kengaUserGroup.id != null
    }
}
