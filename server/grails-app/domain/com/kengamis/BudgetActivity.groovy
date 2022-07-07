package com.kengamis

class BudgetActivity {
    String id
    String activityId
    String budgetLine
    String approvedAmount
    String totalSpent
    String quarterlyBudget
    Date dateCreated
    Date lastUpdated

    static mapping = {
        id generator: 'uuid2'
    }
    static constraints = {
        activityId nullable: false
        budgetLine nullable: true
        approvedAmount nullable: true
        totalSpent nullable: true
        quarterlyBudget nullable: true

    }
}
