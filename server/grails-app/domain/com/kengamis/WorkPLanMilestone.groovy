package com.kengamis

class WorkPLanMilestone {
    String id
    String name
    String workPlanId
    String milestoneId
    String overallTarget
    Date dateCreated
    Date lastUpdated

    static mapping = {
        id generator: 'uuid2'
    }

    static constraints = {
        workPlanId nullable: false
        milestoneId nullable: true
        name nullable: true
        overallTarget nullable: true
    }
}
