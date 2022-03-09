package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class DataViewServiceSpec extends Specification {

    DataViewService dataViewService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new DataView(...).save(flush: true, failOnError: true)
        //new DataView(...).save(flush: true, failOnError: true)
        //DataView dataView = new DataView(...).save(flush: true, failOnError: true)
        //new DataView(...).save(flush: true, failOnError: true)
        //new DataView(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //dataView.id
    }

    void "test get"() {
        setupData()

        expect:
        dataViewService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<DataView> dataViewList = dataViewService.list(max: 2, offset: 2)

        then:
        dataViewList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        dataViewService.count() == 5
    }

    void "test delete"() {
        Long dataViewId = setupData()

        expect:
        dataViewService.count() == 5

        when:
        dataViewService.delete(dataViewId)
        sessionFactory.currentSession.flush()

        then:
        dataViewService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        DataView dataView = new DataView()
        dataViewService.save(dataView)

        then:
        dataView.id != null
    }
}
