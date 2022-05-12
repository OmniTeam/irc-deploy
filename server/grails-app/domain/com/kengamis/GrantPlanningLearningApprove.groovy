package com.kengamis

class GrantPlanningLearningApprove {

    String id
    String grantId

    String decision
    String comments

    String definitionKey
    String processInstanceId
    String partnerId
    String status
    Date dateCreated
    Date lastUpdated

    GrantPlanningLearning grantPlanningLearning

    static constraints = {
    }

    static mapping = {
        id generator: 'uuid2'
    }
}
