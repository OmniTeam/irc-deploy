package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class EntityFormFieldMapServiceSpec extends Specification {

    EntityFormFieldMapService entityFormFieldMapService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new EntityFormFieldMap(...).save(flush: true, failOnError: true)
        //new EntityFormFieldMap(...).save(flush: true, failOnError: true)
        //EntityFormFieldMap entityFormFieldMap = new EntityFormFieldMap(...).save(flush: true, failOnError: true)
        //new EntityFormFieldMap(...).save(flush: true, failOnError: true)
        //new EntityFormFieldMap(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //entityFormFieldMap.id
    }

    void "test get"() {
        setupData()

        expect:
        entityFormFieldMapService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<EntityFormFieldMap> entityFormFieldMapList = entityFormFieldMapService.list(max: 2, offset: 2)

        then:
        entityFormFieldMapList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        entityFormFieldMapService.count() == 5
    }

    void "test delete"() {
        Long entityFormFieldMapId = setupData()

        expect:
        entityFormFieldMapService.count() == 5

        when:
        entityFormFieldMapService.delete(entityFormFieldMapId)
        sessionFactory.currentSession.flush()

        then:
        entityFormFieldMapService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        EntityFormFieldMap entityFormFieldMap = new EntityFormFieldMap()
        entityFormFieldMapService.save(entityFormFieldMap)

        then:
        entityFormFieldMap.id != null
    }
}
