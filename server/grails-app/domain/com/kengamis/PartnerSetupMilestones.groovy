package com.kengamis

class PartnerSetupMilestones {

    String id
    String partnerSetupId

    String name
    String milestoneId
    String overallTarget
    String disaggregation

    Date dateCreated
    Date lastUpdated

    static constraints = {
        disaggregation nullable: true
    }

    static mapping = {
        id generator: 'uuid2'
        disaggregation type: 'text'
    }
}
