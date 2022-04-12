package com.kengamis

class Clients {
    String id
    String partnerName
    String dateOfRegistration
    String caseId
    String district
    String division
    String parish
    String nationality
    String gender
    String disability
    String registerStatus
    String ageCategory
    String identificationDocument
    String identificationNumber
    String countryOfOrigin

    static mapping = {
        id generator: 'uuid2'
    }

    static constraints = {
        dateOfRegistration nullable: false
        caseId nullable: true
        nationality nullable: true
        gender nullable: true
        district nullable: true
        parish nullable: true
        division nullable: true
        partnerName nullable: true
        disability nullable: true
        registerStatus nullable: true
        ageCategory nullable: true
        countryOfOrigin nullable: true
        identificationDocument nullable: true
        identificationNumber nullable: true
    }

    @Override
    public String toString() {
        return "${case_id}"
    }
}
