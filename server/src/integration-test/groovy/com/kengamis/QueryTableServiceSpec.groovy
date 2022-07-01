package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class QueryTableServiceSpec extends Specification {

    QueryTableService queryTableService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new QueryTable(...).save(flush: true, failOnError: true)
        //new QueryTable(...).save(flush: true, failOnError: true)
        //QueryTable queryTable = new QueryTable(...).save(flush: true, failOnError: true)
        //new QueryTable(...).save(flush: true, failOnError: true)
        //new QueryTable(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //queryTable.id
    }

    void "test get"() {
        setupData()

        expect:
        queryTableService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<QueryTable> queryTableList = queryTableService.list(max: 2, offset: 2)

        then:
        queryTableList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        queryTableService.count() == 5
    }

    void "test delete"() {
        Long queryTableId = setupData()

        expect:
        queryTableService.count() == 5

        when:
        queryTableService.delete(queryTableId)
        sessionFactory.currentSession.flush()

        then:
        queryTableService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        QueryTable queryTable = new QueryTable()
        queryTableService.save(queryTable)

        then:
        queryTable.id != null
    }
}
