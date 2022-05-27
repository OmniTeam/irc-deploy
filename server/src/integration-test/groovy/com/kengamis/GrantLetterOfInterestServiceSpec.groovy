package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class GrantLetterOfInterestServiceSpec extends Specification {

    GrantLetterOfInterestService grantLetterOfInterestService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new GrantLetterOfInterest(...).save(flush: true, failOnError: true)
        //new GrantLetterOfInterest(...).save(flush: true, failOnError: true)
        //GrantLetterOfInterest grantLetterOfInterest = new GrantLetterOfInterest(...).save(flush: true, failOnError: true)
        //new GrantLetterOfInterest(...).save(flush: true, failOnError: true)
        //new GrantLetterOfInterest(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //grantLetterOfInterest.id
    }

    void "test get"() {
        setupData()

        expect:
        grantLetterOfInterestService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<GrantLetterOfInterest> grantLetterOfInterestList = grantLetterOfInterestService.list(max: 2, offset: 2)

        then:
        grantLetterOfInterestList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        grantLetterOfInterestService.count() == 5
    }

    void "test delete"() {
        Long grantLetterOfInterestId = setupData()

        expect:
        grantLetterOfInterestService.count() == 5

        when:
        grantLetterOfInterestService.delete(grantLetterOfInterestId)
        sessionFactory.currentSession.flush()

        then:
        grantLetterOfInterestService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        GrantLetterOfInterest grantLetterOfInterest = new GrantLetterOfInterest()
        grantLetterOfInterestService.save(grantLetterOfInterest)

        then:
        grantLetterOfInterest.id != null
    }
}
