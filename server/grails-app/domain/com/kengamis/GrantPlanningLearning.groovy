package com.kengamis

class GrantPlanningLearning {

    String id
    String grantId
    String addressContactPerson
    String bankDetails
    String contactAuthorizedSignatory
    String contactPersonNumber
    String emailContactPerson
    String nameAuthorizedSignatory
    String otherOrganization
    String otherSources
    String proposedDuration
    String proposedStartDate
    int amountRequested
    int totalBudgetAmt
    String definitionKey
    String processInstanceId
    String status
    Date dateCreated
    Date lastUpdated

    static constraints = {
        status nullable: true
    }

    static mapping = {
        id generator: 'uuid2'
    }
}
