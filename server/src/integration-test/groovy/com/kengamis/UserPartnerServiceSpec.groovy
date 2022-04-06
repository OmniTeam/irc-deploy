package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class UserPartnerServiceSpec extends Specification {

    UserPartnerService userPartnerService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new UserPartner(...).save(flush: true, failOnError: true)
        //new UserPartner(...).save(flush: true, failOnError: true)
        //UserPartner userPartner = new UserPartner(...).save(flush: true, failOnError: true)
        //new UserPartner(...).save(flush: true, failOnError: true)
        //new UserPartner(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //userPartner.id
    }

    void "test get"() {
        setupData()

        expect:
        userPartnerService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<UserPartner> userPartnerList = userPartnerService.list(max: 2, offset: 2)

        then:
        userPartnerList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        userPartnerService.count() == 5
    }

    void "test delete"() {
        Long userPartnerId = setupData()

        expect:
        userPartnerService.count() == 5

        when:
        userPartnerService.delete(userPartnerId)
        sessionFactory.currentSession.flush()

        then:
        userPartnerService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        UserPartner userPartner = new UserPartner()
        userPartnerService.save(userPartner)

        then:
        userPartner.id != null
    }
}
