package com.kengamis

class GrantPlanningLearningReview {

    String id
    String grantId

    String isConceptInline
    String doesItAdhere
    String areTheyAdhering
    String decision
    String comments

    String definitionKey
    String processInstanceId
    String status
    Date dateCreated
    Date lastUpdated

    GrantPlanningLearning grantPlanningLearning

    static constraints = {
        status nullable: true
    }

    static mapping = {
        id generator: 'uuid2'
    }
}
