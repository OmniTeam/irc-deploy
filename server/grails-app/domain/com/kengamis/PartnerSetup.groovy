package com.kengamis

class PartnerSetup {

    String id
    String userId
    String partnerId
    String programId
    String setupValues
    String startDate
    String endDate
    String reportingStartDate
    String startCycle
    String periodType
    Date dateCreated
    Date lastUpdated


    static mapping = {
        id generator: 'uuid2'
    }
    static constraints = {
    }
}
