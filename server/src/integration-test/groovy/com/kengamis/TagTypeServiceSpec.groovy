package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class TagTypeServiceSpec extends Specification {

    TagTypeService tagTypeService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new TagType(...).save(flush: true, failOnError: true)
        //new TagType(...).save(flush: true, failOnError: true)
        //TagType tagType = new TagType(...).save(flush: true, failOnError: true)
        //new TagType(...).save(flush: true, failOnError: true)
        //new TagType(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //tagType.id
    }

    void "test get"() {
        setupData()

        expect:
        tagTypeService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<TagType> tagTypeList = tagTypeService.list(max: 2, offset: 2)

        then:
        tagTypeList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        tagTypeService.count() == 5
    }

    void "test delete"() {
        Long tagTypeId = setupData()

        expect:
        tagTypeService.count() == 5

        when:
        tagTypeService.delete(tagTypeId)
        sessionFactory.currentSession.flush()

        then:
        tagTypeService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        TagType tagType = new TagType()
        tagTypeService.save(tagType)

        then:
        tagType.id != null
    }
}
