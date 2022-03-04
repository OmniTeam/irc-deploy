package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class ProgramPartnerServiceSpec extends Specification {

    ProgramPartnerService programPartnerService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new ProgramPartner(...).save(flush: true, failOnError: true)
        //new ProgramPartner(...).save(flush: true, failOnError: true)
        //ProgramPartner programPartner = new ProgramPartner(...).save(flush: true, failOnError: true)
        //new ProgramPartner(...).save(flush: true, failOnError: true)
        //new ProgramPartner(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //programPartner.id
    }

    void "test get"() {
        setupData()

        expect:
        programPartnerService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<ProgramPartner> programPartnerList = programPartnerService.list(max: 2, offset: 2)

        then:
        programPartnerList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        programPartnerService.count() == 5
    }

    void "test delete"() {
        Long programPartnerId = setupData()

        expect:
        programPartnerService.count() == 5

        when:
        programPartnerService.delete(programPartnerId)
        sessionFactory.currentSession.flush()

        then:
        programPartnerService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        ProgramPartner programPartner = new ProgramPartner()
        programPartnerService.save(programPartner)

        then:
        programPartner.id != null
    }
}
