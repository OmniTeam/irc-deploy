package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class EntityViewFieldsServiceSpec extends Specification {

    EntityViewFieldsService entityViewFieldsService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new EntityViewFields(...).save(flush: true, failOnError: true)
        //new EntityViewFields(...).save(flush: true, failOnError: true)
        //EntityViewFields entityViewFields = new EntityViewFields(...).save(flush: true, failOnError: true)
        //new EntityViewFields(...).save(flush: true, failOnError: true)
        //new EntityViewFields(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //entityViewFields.id
    }

    void "test get"() {
        setupData()

        expect:
        entityViewFieldsService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<EntityViewFields> entityViewFieldsList = entityViewFieldsService.list(max: 2, offset: 2)

        then:
        entityViewFieldsList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        entityViewFieldsService.count() == 5
    }

    void "test delete"() {
        Long entityViewFieldsId = setupData()

        expect:
        entityViewFieldsService.count() == 5

        when:
        entityViewFieldsService.delete(entityViewFieldsId)
        sessionFactory.currentSession.flush()

        then:
        entityViewFieldsService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        EntityViewFields entityViewFields = new EntityViewFields()
        entityViewFieldsService.save(entityViewFields)

        then:
        entityViewFields.id != null
    }
}
