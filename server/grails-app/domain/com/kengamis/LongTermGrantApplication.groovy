package com.kengamis

class LongTermGrantApplication {

    String id
    String projectTitle
    String projectDuration
    String projectAmount
    String amountRequested
    String funding
    String nameAuthorizedSignatory
    String contactAuthorizedSignatory
    String bankDetails
    String problemBackground
    String problemAddressed
    String targetPopulation
    String reasonForTargetPopulation
    String whatChangeExpected
    String overallGoal
    String midtermChanges
    String immediateChanges
    String activities
    String risksAndChallenges
    String partnershipsAndNetworks
    String changeEnvisioned
    String structuresAndPlans
    String totalProjectCostLocalCurrency
    String totalProjectCostDollars
    String documents

    String grantId
    String processInstanceId
    String definitionKey
    String status

    static mapping = {
        id generator: 'uuid2'
        bankDetails type: 'text'
        documents type: 'text'
        problemBackground type: 'text'
        problemAddressed type: 'text'
        targetPopulation type: 'text'
        reasonForTargetPopulation type: 'text'
        whatChangeExpected type: 'text'
        overallGoal type: 'text'
        midtermChanges type: 'text'
        immediateChanges type: 'text'
        activities type: 'text'
        risksAndChallenges type: 'text'
        partnershipsAndNetworks type: 'text'
        changeEnvisioned type: 'text'
        structuresAndPlans type: 'text'
        funding type: 'text'
    }

    static constraints = {
    }
}
