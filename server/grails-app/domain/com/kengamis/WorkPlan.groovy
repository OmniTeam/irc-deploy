package com.kengamis

class WorkPlan {

    String id
    String userId
    String staffId
    String programId
    String setupValues
    String startDate
    String endDate
    String reportingStartDate
    String reportingEndDate
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
