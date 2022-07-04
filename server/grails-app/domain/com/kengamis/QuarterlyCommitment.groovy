package com.kengamis

class QuarterlyCommitment {
    String id
    String datePeriod
    String startDate
    String endDate
    String commitment
    String workPlanId
    Date dateCreated
    Date lastUpdated


    static mapping = {
        id generator: 'uuid2'
    }

    static constraints = {
        datePeriod nullable: true
        startDate nullable: true
        endDate nullable: true
        commitment nullable: true
        workPlanId nullable: false
    }
}
