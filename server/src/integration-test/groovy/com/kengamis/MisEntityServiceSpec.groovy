package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class MisEntityServiceSpec extends Specification {

    MisEntityService misEntityService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new MisEntity(...).save(flush: true, failOnError: true)
        //new MisEntity(...).save(flush: true, failOnError: true)
        //MisEntity misEntity = new MisEntity(...).save(flush: true, failOnError: true)
        //new MisEntity(...).save(flush: true, failOnError: true)
        //new MisEntity(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //misEntity.id
    }

    void "test get"() {
        setupData()

        expect:
        misEntityService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<MisEntity> misEntityList = misEntityService.list(max: 2, offset: 2)

        then:
        misEntityList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        misEntityService.count() == 5
    }

    void "test delete"() {
        Long misEntityId = setupData()

        expect:
        misEntityService.count() == 5

        when:
        misEntityService.delete(misEntityId)
        sessionFactory.currentSession.flush()

        then:
        misEntityService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        MisEntity misEntity = new MisEntity()
        misEntityService.save(misEntity)

        then:
        misEntity.id != null
    }
}
