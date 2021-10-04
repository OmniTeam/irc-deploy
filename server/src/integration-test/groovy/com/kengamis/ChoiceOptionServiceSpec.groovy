package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class ChoiceOptionServiceSpec extends Specification {

    ChoiceOptionService choiceOptionService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new ChoiceOption(...).save(flush: true, failOnError: true)
        //new ChoiceOption(...).save(flush: true, failOnError: true)
        //ChoiceOption choiceOption = new ChoiceOption(...).save(flush: true, failOnError: true)
        //new ChoiceOption(...).save(flush: true, failOnError: true)
        //new ChoiceOption(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //choiceOption.id
    }

    void "test get"() {
        setupData()

        expect:
        choiceOptionService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<ChoiceOption> choiceOptionList = choiceOptionService.list(max: 2, offset: 2)

        then:
        choiceOptionList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        choiceOptionService.count() == 5
    }

    void "test delete"() {
        Long choiceOptionId = setupData()

        expect:
        choiceOptionService.count() == 5

        when:
        choiceOptionService.delete(choiceOptionId)
        sessionFactory.currentSession.flush()

        then:
        choiceOptionService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        ChoiceOption choiceOption = new ChoiceOption()
        choiceOptionService.save(choiceOption)

        then:
        choiceOption.id != null
    }
}
