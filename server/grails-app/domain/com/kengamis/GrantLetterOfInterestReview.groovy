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
    String definitionKey
    String processInstanceId
    String partnerId
    String status
    Date dateCreated
    Date lastUpdated
    GrantLetterOfInterest grantLetterOfInterest

    static constraints = {
    }

    static mapping = {
        id generator: 'uuid2'
    }
}
