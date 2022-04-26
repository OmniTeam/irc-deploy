package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification

@Integration
@Rollback
class DbConnectionSpec extends Specification {

    void setupData() {
        new User(username: 'test', password: 'test@1234').save(flush: true)
    }

    def cleanup() {
    }

    void "test something"() {
        given:
        setupData()

        expect:
        User.count() > 0
    }
}