package com.kengamis

class QuarterlyBudget {

    String id
    String workPlanBudgetId
    String workPlanId
    String datePeriod
    String amount
    Date dateCreated
    Date lastUpdated

    static mapping = {
        id generator: 'uuid2'
    }

    static constraints = {
        workPlanBudgetId nullable: false
        workPlanId nullable: false
        datePeriod nullable: true
        amount nullable: true
    }
}
