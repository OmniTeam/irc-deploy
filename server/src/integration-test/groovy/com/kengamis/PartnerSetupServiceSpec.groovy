package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class PartnerSetupServiceSpec extends Specification {

    PartnerSetupService partnerSetupService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new PartnerSetup(...).save(flush: true, failOnError: true)
        //new PartnerSetup(...).save(flush: true, failOnError: true)
        //PartnerSetup partnerSetup = new PartnerSetup(...).save(flush: true, failOnError: true)
        //new PartnerSetup(...).save(flush: true, failOnError: true)
        //new PartnerSetup(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //partnerSetup.id
    }

    void "test get"() {
        setupData()

        expect:
        partnerSetupService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<PartnerSetup> partnerSetupList = partnerSetupService.list(max: 2, offset: 2)

        then:
        partnerSetupList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        partnerSetupService.count() == 5
    }

    void "test delete"() {
        Long partnerSetupId = setupData()

        expect:
        partnerSetupService.count() == 5

        when:
        partnerSetupService.delete(partnerSetupId)
        sessionFactory.currentSession.flush()

        then:
        partnerSetupService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        PartnerSetup partnerSetup = new PartnerSetup()
        partnerSetupService.save(partnerSetup)

        then:
        partnerSetup.id != null
    }
}
