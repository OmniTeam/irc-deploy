package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class ClientsServiceSpec extends Specification {

    ClientsService clientsService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new Clients(...).save(flush: true, failOnError: true)
        //new Clients(...).save(flush: true, failOnError: true)
        //Clients clients = new Clients(...).save(flush: true, failOnError: true)
        //new Clients(...).save(flush: true, failOnError: true)
        //new Clients(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //clients.id
    }

    void "test get"() {
        setupData()

        expect:
        clientsService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<Clients> clientsList = clientsService.list(max: 2, offset: 2)

        then:
        clientsList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        clientsService.count() == 5
    }

    void "test delete"() {
        Long clientsId = setupData()

        expect:
        clientsService.count() == 5

        when:
        clientsService.delete(clientsId)
        sessionFactory.currentSession.flush()

        then:
        clientsService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        Clients clients = new Clients()
        clientsService.save(clients)

        then:
        clients.id != null
    }
}
