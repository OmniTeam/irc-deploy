package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class RequestMapServiceSpec extends Specification {

    RequestMapService requestMapService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new RequestMap(...).save(flush: true, failOnError: true)
        //new RequestMap(...).save(flush: true, failOnError: true)
        //RequestMap requestMap = new RequestMap(...).save(flush: true, failOnError: true)
        //new RequestMap(...).save(flush: true, failOnError: true)
        //new RequestMap(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //requestMap.id
    }

    void "test get"() {
        setupData()

        expect:
        requestMapService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<RequestMap> requestMapList = requestMapService.list(max: 2, offset: 2)

        then:
        requestMapList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        requestMapService.count() == 5
    }

    void "test delete"() {
        Long requestMapId = setupData()

        expect:
        requestMapService.count() == 5

        when:
        requestMapService.delete(requestMapId)
        sessionFactory.currentSession.flush()

        then:
        requestMapService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        RequestMap requestMap = new RequestMap()
        requestMapService.save(requestMap)

        then:
        requestMap.id != null
    }
}
