package com.kengamis

class GrantLetterOfInterest {

    String id
    String program

    String organisation
    String ngos
    String proposal
    String financial
    String documents

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
