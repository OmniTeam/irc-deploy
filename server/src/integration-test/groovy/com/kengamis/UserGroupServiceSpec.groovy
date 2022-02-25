package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class UserGroupServiceSpec extends Specification {

    UserGroupService userGroupService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new UserGroup(...).save(flush: true, failOnError: true)
        //new UserGroup(...).save(flush: true, failOnError: true)
        //UserGroup userGroup = new UserGroup(...).save(flush: true, failOnError: true)
        //new UserGroup(...).save(flush: true, failOnError: true)
        //new UserGroup(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //userGroup.id
    }

    void "test get"() {
        setupData()

        expect:
        userGroupService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<UserGroup> userGroupList = userGroupService.list(max: 2, offset: 2)

        then:
        userGroupList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        userGroupService.count() == 5
    }

    void "test delete"() {
        Long userGroupId = setupData()

        expect:
        userGroupService.count() == 5

        when:
        userGroupService.delete(userGroupId)
        sessionFactory.currentSession.flush()

        then:
        userGroupService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        UserGroup userGroup = new UserGroup()
        userGroupService.save(userGroup)

        then:
        userGroup.id != null
    }
}
