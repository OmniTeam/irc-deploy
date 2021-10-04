package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class FormSettingServiceSpec extends Specification {

    FormSettingService formSettingService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new FormSetting(...).save(flush: true, failOnError: true)
        //new FormSetting(...).save(flush: true, failOnError: true)
        //FormSetting formSetting = new FormSetting(...).save(flush: true, failOnError: true)
        //new FormSetting(...).save(flush: true, failOnError: true)
        //new FormSetting(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //formSetting.id
    }

    void "test get"() {
        setupData()

        expect:
        formSettingService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<FormSetting> formSettingList = formSettingService.list(max: 2, offset: 2)

        then:
        formSettingList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        formSettingService.count() == 5
    }

    void "test delete"() {
        Long formSettingId = setupData()

        expect:
        formSettingService.count() == 5

        when:
        formSettingService.delete(formSettingId)
        sessionFactory.currentSession.flush()

        then:
        formSettingService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        FormSetting formSetting = new FormSetting()
        formSettingService.save(formSetting)

        then:
        formSetting.id != null
    }
}
