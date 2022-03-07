package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class ProgramStaffServiceSpec extends Specification {

    ProgramStaffService programStaffService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new programStaff(...).save(flush: true, failOnError: true)
        //new programStaff(...).save(flush: true, failOnError: true)
        //ProgramStaff programStaff = new ProgramStaff(...).save(flush: true, failOnError: true)
        //new ProgramStaff(...).save(flush: true, failOnError: true)
        //new ProgramStaff(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //programStaff.id
    }

    void "test get"() {
        setupData()

        expect:
        programStaffService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<ProgramStaff> programStaffList = programStaffService.list(max: 2, offset: 2)

        then:
        programStaffList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        programStaffService.count() == 5
    }

    void "test delete"() {
        Long programStaffId = setupData()

        expect:
        programStaffService.count() == 5

        when:
        programStaffService.delete(programStaffId)
        sessionFactory.currentSession.flush()

        then:
        programStaffService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        ProgramStaff programStaff = new ProgramStaff()
        programStaffService.save(programStaff)

        then:
        programStaff.id != null
    }
}
