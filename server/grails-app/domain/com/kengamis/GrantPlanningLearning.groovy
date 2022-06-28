package com.kengamis

class GrantPlanningLearning {

    String id
    String grantId
    String bankDetails
    String contactAuthorizedSignatory
    String nameAuthorizedSignatory
    String title
    String otherSources
    String proposedDuration
    String proposedStartDate
    String sixMonthsManaged
    String activitiesAndStrategies
    String risksAndChallenges
    String learningAndDocumentation
    String costOfProjectLocalCurrency
    String costOfProjectDollars
    String attachment
    String mou_attachment
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
