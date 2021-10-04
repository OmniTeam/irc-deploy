package com.kengamis

import grails.gorm.transactions.Transactional

/**
 * CentralService
 * A service class encapsulates the core business logic of a Grails application
 */
class CentralService {

    String token

    synchronized String get() {
        return token
    }

    synchronized void set(String token) {
        this.token = token
    }

    synchronized String auth() {
        def sessiontoken = RestHelper.withCentral {
            def data = login()
            if(data) {
                return data.token
            }
        }
        this.token = sessiontoken
        return this.token
    }
}
