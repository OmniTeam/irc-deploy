package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class UserEntityViewFiltersServiceSpec extends Specification {

    UserEntityViewFiltersService userEntityViewFiltersService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new UserEntityViewFilters(...).save(flush: true, failOnError: true)
        //new UserEntityViewFilters(...).save(flush: true, failOnError: true)
        //UserEntityViewFilters userEntityViewFilters = new UserEntityViewFilters(...).save(flush: true, failOnError: true)
        //new UserEntityViewFilters(...).save(flush: true, failOnError: true)
        //new UserEntityViewFilters(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //userEntityViewFilters.id
    }

    void "test get"() {
        setupData()

        expect:
        userEntityViewFiltersService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<UserEntityViewFilters> userEntityViewFiltersList = userEntityViewFiltersService.list(max: 2, offset: 2)

        then:
        userEntityViewFiltersList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        userEntityViewFiltersService.count() == 5
    }

    void "test delete"() {
        Long userEntityViewFiltersId = setupData()

        expect:
        userEntityViewFiltersService.count() == 5

        when:
        userEntityViewFiltersService.delete(userEntityViewFiltersId)
        sessionFactory.currentSession.flush()

        then:
        userEntityViewFiltersService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        UserEntityViewFilters userEntityViewFilters = new UserEntityViewFilters()
        userEntityViewFiltersService.save(userEntityViewFilters)

        then:
        userEntityViewFilters.id != null
    }
}
