package com.kengamis

class WorkPLanBudget {
    String id
    String budgetLine
    String totalSpent
    String quarterlySpendingPlan
    String workPlanId
    Date dateCreated
    Date lastUpdated

    static mapping = {
        id generator: 'uuid2'
    }

    static constraints = {
        budgetLine nullable: true
        totalSpent nullable: true
        quarterlySpendingPlan  nullable: true
        workPlanId nullable: true

    }
}
