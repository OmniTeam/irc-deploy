package com.kengamis

class MilestoneDisaggregation {
    String id
    String datePeriod
    String target
    String workPlanId
    String milestoneId
    Date dateCreated
    Date lastUpdated

    static mapping = {
        id generator: 'uuid2'
    }

    static constraints = {
        datePeriod nullable: true
        target nullable: true
        workPlanId nullable: false
        milestoneId nullable: false
    }
}
