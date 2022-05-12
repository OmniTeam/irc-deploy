package com.kengamis

class GrantLetterOfInterest {

    String id
    String partnerId
    String program
    String organisation
    String organizationType
    String acronym
    String addressContactPerson
    String city
    String contactPerson
    String contactPersonNumber
    String country
    String email
    String emailAddress
    String legalStatus
    String physicalAddress
    String postalAddress
    String website
    String letterAttachment
    String status
    Date dateCreated
    Date lastUpdated

    static constraints = {
    }

    static mapping = {
        id generator: 'uuid2'
    }
}
