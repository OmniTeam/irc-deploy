package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class ArchiveServiceSpec extends Specification {

    ArchiveService archiveService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new Archive(...).save(flush: true, failOnError: true)
        //new Archive(...).save(flush: true, failOnError: true)
        //Archive archive = new Archive(...).save(flush: true, failOnError: true)
        //new Archive(...).save(flush: true, failOnError: true)
        //new Archive(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //archive.id
    }

    void "test get"() {
        setupData()

        expect:
        archiveService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<Archive> archiveList = archiveService.list(max: 2, offset: 2)

        then:
        archiveList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        archiveService.count() == 5
    }

    void "test delete"() {
        Long archiveId = setupData()

        expect:
        archiveService.count() == 5

        when:
        archiveService.delete(archiveId)
        sessionFactory.currentSession.flush()

        then:
        archiveService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        Archive archive = new Archive()
        archiveService.save(archive)

        then:
        archive.id != null
    }
}
