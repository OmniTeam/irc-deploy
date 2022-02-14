package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class EntityFormServiceSpec extends Specification {

    EntityFormService entityFormService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new EntityForm(...).save(flush: true, failOnError: true)
        //new EntityForm(...).save(flush: true, failOnError: true)
        //EntityForm entityForm = new EntityForm(...).save(flush: true, failOnError: true)
        //new EntityForm(...).save(flush: true, failOnError: true)
        //new EntityForm(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //entityForm.id
    }

    void "test get"() {
        setupData()

        expect:
        entityFormService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<EntityForm> entityFormList = entityFormService.list(max: 2, offset: 2)

        then:
        entityFormList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        entityFormService.count() == 5
    }

    void "test delete"() {
        Long entityFormId = setupData()

        expect:
        entityFormService.count() == 5

        when:
        entityFormService.delete(entityFormId)
        sessionFactory.currentSession.flush()

        then:
        entityFormService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        EntityForm entityForm = new EntityForm()
        entityFormService.save(entityForm)

        then:
        entityForm.id != null
    }
}
