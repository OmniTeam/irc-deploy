package com.kengamis

class GrantPlanningLearningReview {

    String id
    String grantId

    String isConceptInline
    String doesItAdhere
    String areTheyAdhering
    String decision
    String comments
    String user

    String definitionKey
    String processInstanceId
    String status
    Date dateCreated
    Date lastUpdated

    static constraints = {
        status nullable: true
        user nullable: true
        isConceptInline nullable: true
        doesItAdhere nullable: true
        areTheyAdhering nullable: true
        decision nullable: true
        comments nullable: true
    }

    static mapping = {
        id generator: 'uuid2'
    }
}
