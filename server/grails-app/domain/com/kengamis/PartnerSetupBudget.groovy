package com.kengamis

class PartnerSetupBudget {

    String id
    String partnerSetupId

    String budgetLine
    String milestoneId
    String approvedAmount
    String totalSpent

    Date dateCreated
    Date lastUpdated

    static constraints = {
        milestoneId nullable: true
        approvedAmount nullable: true
        totalSpent nullable: true
    }

    static mapping = {
        id generator: 'uuid2'
    }
}
