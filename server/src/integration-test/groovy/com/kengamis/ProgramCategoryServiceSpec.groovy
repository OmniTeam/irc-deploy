package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class ProgramCategoryServiceSpec extends Specification {

    ProgramCategoryService programCategoryService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new ProgramCategory(...).save(flush: true, failOnError: true)
        //new ProgramCategory(...).save(flush: true, failOnError: true)
        //ProgramCategory programCategory = new ProgramCategory(...).save(flush: true, failOnError: true)
        //new ProgramCategory(...).save(flush: true, failOnError: true)
        //new ProgramCategory(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //programCategory.id
    }

    void "test get"() {
        setupData()

        expect:
        programCategoryService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<ProgramCategory> programCategoryList = programCategoryService.list(max: 2, offset: 2)

        then:
        programCategoryList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        programCategoryService.count() == 5
    }

    void "test delete"() {
        Long programCategoryId = setupData()

        expect:
        programCategoryService.count() == 5

        when:
        programCategoryService.delete(programCategoryId)
        sessionFactory.currentSession.flush()

        then:
        programCategoryService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        ProgramCategory programCategory = new ProgramCategory()
        programCategoryService.save(programCategory)

        then:
        programCategory.id != null
    }
}
