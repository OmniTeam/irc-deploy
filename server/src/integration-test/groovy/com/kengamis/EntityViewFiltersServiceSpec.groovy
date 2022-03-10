package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class EntityViewFiltersServiceSpec extends Specification {

    EntityViewFiltersService entityViewFiltersService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new EntityViewFilters(...).save(flush: true, failOnError: true)
        //new EntityViewFilters(...).save(flush: true, failOnError: true)
        //EntityViewFilters entityViewFilters = new EntityViewFilters(...).save(flush: true, failOnError: true)
        //new EntityViewFilters(...).save(flush: true, failOnError: true)
        //new EntityViewFilters(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //entityViewFilters.id
    }

    void "test get"() {
        setupData()

        expect:
        entityViewFiltersService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<EntityViewFilters> entityViewFiltersList = entityViewFiltersService.list(max: 2, offset: 2)

        then:
        entityViewFiltersList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        entityViewFiltersService.count() == 5
    }

    void "test delete"() {
        Long entityViewFiltersId = setupData()

        expect:
        entityViewFiltersService.count() == 5

        when:
        entityViewFiltersService.delete(entityViewFiltersId)
        sessionFactory.currentSession.flush()

        then:
        entityViewFiltersService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        EntityViewFilters entityViewFilters = new EntityViewFilters()
        entityViewFiltersService.save(entityViewFilters)

        then:
        entityViewFilters.id != null
    }
}
