package com.kengamis

class GrantLetterOfInterestReview {

    String id
    String grantId

    String hasBeenReviewed
    String dueDiligence
    String decision
    String dateOfDueDiligence
    String dueDiligenceReport
    String comments
    String recommendations
    String user

    String definitionKey
    String processInstanceId
    String status
    Date dateCreated
    Date lastUpdated

    static constraints = {
        status nullable: true
        user nullable: true
        hasBeenReviewed nullable: true
        dueDiligence nullable: true
        decision nullable: true
        dateOfDueDiligence nullable: true
        dueDiligenceReport nullable: true
        comments nullable: true
        recommendations nullable: true
    }

    static mapping = {
        id generator: 'uuid2'
    }
}
