package com.kengamis.acl

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class KengaGroupAclEntryServiceSpec extends Specification {

    KengaGroupAclEntryService kengaGroupAclEntryService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new KengaGroupAclEntry(...).save(flush: true, failOnError: true)
        //new KengaGroupAclEntry(...).save(flush: true, failOnError: true)
        //KengaGroupAclEntry kengaGroupAclEntry = new KengaGroupAclEntry(...).save(flush: true, failOnError: true)
        //new KengaGroupAclEntry(...).save(flush: true, failOnError: true)
        //new KengaGroupAclEntry(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //kengaGroupAclEntry.id
    }

    void "test get"() {
        setupData()

        expect:
        kengaGroupAclEntryService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<KengaGroupAclEntry> kengaGroupAclEntryList = kengaGroupAclEntryService.list(max: 2, offset: 2)

        then:
        kengaGroupAclEntryList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        kengaGroupAclEntryService.count() == 5
    }

    void "test delete"() {
        Long kengaGroupAclEntryId = setupData()

        expect:
        kengaGroupAclEntryService.count() == 5

        when:
        kengaGroupAclEntryService.delete(kengaGroupAclEntryId)
        sessionFactory.currentSession.flush()

        then:
        kengaGroupAclEntryService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        KengaGroupAclEntry kengaGroupAclEntry = new KengaGroupAclEntry()
        kengaGroupAclEntryService.save(kengaGroupAclEntry)

        then:
        kengaGroupAclEntry.id != null
    }
}
