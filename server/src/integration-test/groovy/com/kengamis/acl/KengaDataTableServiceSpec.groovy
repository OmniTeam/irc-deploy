package com.kengamis.acl

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class KengaDataTableServiceSpec extends Specification {

    KengaDataTableService kengaDataTableService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new KengaDataTable(...).save(flush: true, failOnError: true)
        //new KengaDataTable(...).save(flush: true, failOnError: true)
        //KengaDataTable kengaDataTable = new KengaDataTable(...).save(flush: true, failOnError: true)
        //new KengaDataTable(...).save(flush: true, failOnError: true)
        //new KengaDataTable(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //kengaDataTable.id
    }

    void "test get"() {
        setupData()

        expect:
        kengaDataTableService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<KengaDataTable> kengaDataTableList = kengaDataTableService.list(max: 2, offset: 2)

        then:
        kengaDataTableList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        kengaDataTableService.count() == 5
    }

    void "test delete"() {
        Long kengaDataTableId = setupData()

        expect:
        kengaDataTableService.count() == 5

        when:
        kengaDataTableService.delete(kengaDataTableId)
        sessionFactory.currentSession.flush()

        then:
        kengaDataTableService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        KengaDataTable kengaDataTable = new KengaDataTable()
        kengaDataTableService.save(kengaDataTable)

        then:
        kengaDataTable.id != null
    }
}
