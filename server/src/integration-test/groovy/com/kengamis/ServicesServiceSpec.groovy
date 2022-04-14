package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class ServicesServiceSpec extends Specification {

    ServicesService servicesService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new Services(...).save(flush: true, failOnError: true)
        //new Services(...).save(flush: true, failOnError: true)
        //Services services = new Services(...).save(flush: true, failOnError: true)
        //new Services(...).save(flush: true, failOnError: true)
        //new Services(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //services.id
    }

    void "test get"() {
        setupData()

        expect:
        servicesService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<Services> servicesList = servicesService.list(max: 2, offset: 2)

        then:
        servicesList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        servicesService.count() == 5
    }

    void "test delete"() {
        Long servicesId = setupData()

        expect:
        servicesService.count() == 5

        when:
        servicesService.delete(servicesId)
        sessionFactory.currentSession.flush()

        then:
        servicesService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        Services services = new Services()
        servicesService.save(services)

        then:
        services.id != null
    }
}
