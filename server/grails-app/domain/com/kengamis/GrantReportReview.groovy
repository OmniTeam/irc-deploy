package com.kengamis

class GrantReportReview {

    String id
    String grantId
    String achieveIntendedObjectives
    String adhereToBudget
    String activitiesInlineWithWorkPlan
    String comments
    String decision
    String status
    String processInstanceId
    String definitionKey
    Date dateCreated
    Date lastUpdated

    static constraints = {
    }

    static mapping = {
        id generator: 'uuid2'
    }
}
