package com.kengamis

class Services {
    String id
    String dateOfService
    String partnerName
    String serviceProvided
    String caseId
    String clientCaseId

    static mapping = {
        id generator: 'uuid2'
    }

    static constraints = {
        dateOfService nullable: true
        partnerName nullable: true
        serviceProvided nullable: true
        caseId nullable: true
        clientCaseId nullable: true
    }
}
