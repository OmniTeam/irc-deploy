package com.kengamis

class LongTermGrantReview {

    String id
    String applicationId
    String type
    String grantId
    String definitionKey
    String processInstanceId
    String decision
    String comments
    String status
    String user

    String dateOfAgreement
    String isConceptInLine
    String doesItAdhere
    String areTheyAdhering

    Date dateCreated
    Date lastUpdated

    static mapping = {
        id generator: 'uuid2'
        comments type: 'text'
    }

    static constraints = {
        dateOfAgreement nullable: true
        isConceptInLine nullable: true
        doesItAdhere nullable: true
        areTheyAdhering nullable: true
    }
}
