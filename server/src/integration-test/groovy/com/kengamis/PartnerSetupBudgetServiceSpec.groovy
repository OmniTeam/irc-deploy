package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class PartnerSetupBudgetServiceSpec extends Specification {

    PartnerSetupBudgetService partnerSetupBudgetService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new PartnerSetupBudget(...).save(flush: true, failOnError: true)
        //new PartnerSetupBudget(...).save(flush: true, failOnError: true)
        //PartnerSetupBudget partnerSetupBudget = new PartnerSetupBudget(...).save(flush: true, failOnError: true)
        //new PartnerSetupBudget(...).save(flush: true, failOnError: true)
        //new PartnerSetupBudget(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //partnerSetupBudget.id
    }

    void "test get"() {
        setupData()

        expect:
        partnerSetupBudgetService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<PartnerSetupBudget> partnerSetupBudgetList = partnerSetupBudgetService.list(max: 2, offset: 2)

        then:
        partnerSetupBudgetList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        partnerSetupBudgetService.count() == 5
    }

    void "test delete"() {
        Long partnerSetupBudgetId = setupData()

        expect:
        partnerSetupBudgetService.count() == 5

        when:
        partnerSetupBudgetService.delete(partnerSetupBudgetId)
        sessionFactory.currentSession.flush()

        then:
        partnerSetupBudgetService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        PartnerSetupBudget partnerSetupBudget = new PartnerSetupBudget()
        partnerSetupBudgetService.save(partnerSetupBudget)

        then:
        partnerSetupBudget.id != null
    }
}
