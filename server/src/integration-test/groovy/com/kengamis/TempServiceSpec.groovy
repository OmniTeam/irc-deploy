package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class TempServiceSpec extends Specification {

    TempService tempService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new Temp(...).save(flush: true, failOnError: true)
        //new Temp(...).save(flush: true, failOnError: true)
        //Temp temp = new Temp(...).save(flush: true, failOnError: true)
        //new Temp(...).save(flush: true, failOnError: true)
        //new Temp(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //temp.id
    }

    void "test get"() {
        setupData()

        expect:
        tempService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<Temp> tempList = tempService.list(max: 2, offset: 2)

        then:
        tempList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        tempService.count() == 5
    }

    void "test delete"() {
        Long tempId = setupData()

        expect:
        tempService.count() == 5

        when:
        tempService.delete(tempId)
        sessionFactory.currentSession.flush()

        then:
        tempService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        Temp temp = new Temp()
        tempService.save(temp)

        then:
        temp.id != null
    }
}
