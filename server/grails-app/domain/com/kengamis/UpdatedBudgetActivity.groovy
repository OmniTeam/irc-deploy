package com.kengamis

class UpdatedBudgetActivity {
    String id
    String balance
    String totalApproved
    String totalSpent
    String budgetDisburse
    String activityId

    static mapping = {
        id generator: 'uuid2'
    }

    static constraints = {
        balance nullable: true
        totalApproved nullable: true
        totalSpent nullable: true
        budgetDisburse nullable: true
        activityId nullable: false
    }
}
