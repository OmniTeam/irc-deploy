package com.kengamis

class PartnerSetup {

    String id
    String userId
    String partnerId
    String setupValues
    Date dateCreated
    Date lastUpdated

    static mapping = {
        id generator: 'uuid2'
    }
    static constraints = {
    }
}
