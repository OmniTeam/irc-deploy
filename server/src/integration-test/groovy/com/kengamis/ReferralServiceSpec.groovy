package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class ReferralServiceSpec extends Specification {

    ReferralService referralService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new Referral(...).save(flush: true, failOnError: true)
        //new Referral(...).save(flush: true, failOnError: true)
        //Referral referral = new Referral(...).save(flush: true, failOnError: true)
        //new Referral(...).save(flush: true, failOnError: true)
        //new Referral(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //referral.id
    }

    void "test get"() {
        setupData()

        expect:
        referralService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<Referral> referralList = referralService.list(max: 2, offset: 2)

        then:
        referralList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        referralService.count() == 5
    }

    void "test delete"() {
        Long referralId = setupData()

        expect:
        referralService.count() == 5

        when:
        referralService.delete(referralId)
        sessionFactory.currentSession.flush()

        then:
        referralService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        Referral referral = new Referral()
        referralService.save(referral)

        then:
        referral.id != null
    }
}
