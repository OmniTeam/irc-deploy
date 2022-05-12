package com.kengamis

class GrantPlanningLearning {

    String id
    String grantId

    String addressContactPerson
    String annualWorkPlan
    String assessmentReport
    String bankDetails
    String childPolicy
    String completedAttachment
    String contactAuthorizedSignatory
    String contactPersonNumber
    String emailContactPerson
    String financialAttachment
    String listMembersAttachment
    String melFrameworkAttachment
    String nameAuthorizedSignatory
    String otherOrganization
    String otherSources
    String proposedDuration
    String proposedStartDate
    String registration
    String strategicPlan
    String structure
    int amountRequested
    int totalBudgetAmt

    String definitionKey
    String processInstanceId
    String partnerId
    String status
    Date dateCreated
    Date lastUpdated

    static constraints = {
    }

    static mapping = {
        id generator: 'uuid2'
    }
}
