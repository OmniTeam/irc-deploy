package com.kengamis

class GrantPlanningLearningApprove {

    String id
    String grantId

    String decision
    String comments

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
