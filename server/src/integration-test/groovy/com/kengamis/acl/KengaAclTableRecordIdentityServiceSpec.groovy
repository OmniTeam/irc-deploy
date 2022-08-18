package com.kengamis.acl

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class KengaAclTableRecordIdentityServiceSpec extends Specification {

    KengaAclTableRecordIdentityService kengaAclTableRecordIdentityService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new KengaAclTableRecordIdentity(...).save(flush: true, failOnError: true)
        //new KengaAclTableRecordIdentity(...).save(flush: true, failOnError: true)
        //KengaAclTableRecordIdentity kengaAclTableRecordIdentity = new KengaAclTableRecordIdentity(...).save(flush: true, failOnError: true)
        //new KengaAclTableRecordIdentity(...).save(flush: true, failOnError: true)
        //new KengaAclTableRecordIdentity(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //kengaAclTableRecordIdentity.id
    }

    void "test get"() {
        setupData()

        expect:
        kengaAclTableRecordIdentityService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<KengaAclTableRecordIdentity> kengaAclTableRecordIdentityList = kengaAclTableRecordIdentityService.list(max: 2, offset: 2)

        then:
        kengaAclTableRecordIdentityList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        kengaAclTableRecordIdentityService.count() == 5
    }

    void "test delete"() {
        Long kengaAclTableRecordIdentityId = setupData()

        expect:
        kengaAclTableRecordIdentityService.count() == 5

        when:
        kengaAclTableRecordIdentityService.delete(kengaAclTableRecordIdentityId)
        sessionFactory.currentSession.flush()

        then:
        kengaAclTableRecordIdentityService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        KengaAclTableRecordIdentity kengaAclTableRecordIdentity = new KengaAclTableRecordIdentity()
        kengaAclTableRecordIdentityService.save(kengaAclTableRecordIdentity)

        then:
        kengaAclTableRecordIdentity.id != null
    }
}
