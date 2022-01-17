package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class EntityFieldsServiceSpec extends Specification {

    EntityFieldsService entityFieldsService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new EntityFields(...).save(flush: true, failOnError: true)
        //new EntityFields(...).save(flush: true, failOnError: true)
        //EntityFields entityFields = new EntityFields(...).save(flush: true, failOnError: true)
        //new EntityFields(...).save(flush: true, failOnError: true)
        //new EntityFields(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //entityFields.id
    }

    void "test get"() {
        setupData()

        expect:
        entityFieldsService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<EntityFields> entityFieldsList = entityFieldsService.list(max: 2, offset: 2)

        then:
        entityFieldsList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        entityFieldsService.count() == 5
    }

    void "test delete"() {
        Long entityFieldsId = setupData()

        expect:
        entityFieldsService.count() == 5

        when:
        entityFieldsService.delete(entityFieldsId)
        sessionFactory.currentSession.flush()

        then:
        entityFieldsService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        EntityFields entityFields = new EntityFields()
        entityFieldsService.save(entityFields)

        then:
        entityFields.id != null
    }
}
