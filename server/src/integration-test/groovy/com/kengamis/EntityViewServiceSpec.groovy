package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class EntityViewServiceSpec extends Specification {

    EntityViewService entityViewService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new EntityView(...).save(flush: true, failOnError: true)
        //new EntityView(...).save(flush: true, failOnError: true)
        //EntityView entityView = new EntityView(...).save(flush: true, failOnError: true)
        //new EntityView(...).save(flush: true, failOnError: true)
        //new EntityView(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //entityView.id
    }

    void "test get"() {
        setupData()

        expect:
        entityViewService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<EntityView> entityViewList = entityViewService.list(max: 2, offset: 2)

        then:
        entityViewList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        entityViewService.count() == 5
    }

    void "test delete"() {
        Long entityViewId = setupData()

        expect:
        entityViewService.count() == 5

        when:
        entityViewService.delete(entityViewId)
        sessionFactory.currentSession.flush()

        then:
        entityViewService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        EntityView entityView = new EntityView()
        entityViewService.save(entityView)

        then:
        entityView.id != null
    }
}
