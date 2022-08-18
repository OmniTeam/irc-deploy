package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class PartnerSetupDisbursementPlanServiceSpec extends Specification {

    PartnerSetupDisbursementPlanService partnerSetupDisbursementPlanService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new PartnerSetupDisbursementPlan(...).save(flush: true, failOnError: true)
        //new PartnerSetupDisbursementPlan(...).save(flush: true, failOnError: true)
        //PartnerSetupDisbursementPlan partnerSetupDisbursementPlan = new PartnerSetupDisbursementPlan(...).save(flush: true, failOnError: true)
        //new PartnerSetupDisbursementPlan(...).save(flush: true, failOnError: true)
        //new PartnerSetupDisbursementPlan(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //partnerSetupDisbursementPlan.id
    }

    void "test get"() {
        setupData()

        expect:
        partnerSetupDisbursementPlanService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<PartnerSetupDisbursementPlan> partnerSetupDisbursementPlanList = partnerSetupDisbursementPlanService.list(max: 2, offset: 2)

        then:
        partnerSetupDisbursementPlanList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        partnerSetupDisbursementPlanService.count() == 5
    }

    void "test delete"() {
        Long partnerSetupDisbursementPlanId = setupData()

        expect:
        partnerSetupDisbursementPlanService.count() == 5

        when:
        partnerSetupDisbursementPlanService.delete(partnerSetupDisbursementPlanId)
        sessionFactory.currentSession.flush()

        then:
        partnerSetupDisbursementPlanService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        PartnerSetupDisbursementPlan partnerSetupDisbursementPlan = new PartnerSetupDisbursementPlan()
        partnerSetupDisbursementPlanService.save(partnerSetupDisbursementPlan)

        then:
        partnerSetupDisbursementPlan.id != null
    }
}
