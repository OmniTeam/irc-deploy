package com.kengamis

class Referral {
    String id
    String assignee
    String dateOfReferral
    String nameOfReferringOfficer
    String nameOfClientBeingReferred
    String phoneNumber
    String dateOfBirth
    String ageCategory
    String countryOfOrigin
    String identificationDocument
    String identificationNumber
    String reasonForReferral
    String organizationReferredTo
    String disability
    String receivedFeedback
    String nationalityStatus
    String feedbackGiven
    String dateOfFeedback
    String followupNeeded
    String followupAreas
    String followupOrganization
    String status
    Date dateCreated
    Date lastUpdated

    static mapping = {
        id generator: 'uuid2'
    }

    static constraints = {
        assignee nullable: true
        dateOfReferral nullable: false
        nameOfReferringOfficer nullable: false
        nameOfClientBeingReferred nullable: false
        phoneNumber nullable: true
        dateOfBirth nullable: true
        ageCategory nullable: true
        countryOfOrigin nullable: true
        identificationDocument nullable: true
        identificationNumber nullable: true
        reasonForReferral nullable: true
        organizationReferredTo nullable: true
        disability nullable: true
        status nullable: true
        receivedFeedback nullable: true
        nationalityStatus nullable: true
        feedbackGiven nullable: true
        dateOfFeedback nullable: true
        followupNeeded nullable: true
        followupAreas nullable: true
        followupOrganization nullable: true
    }

    @Override
    // Override toString for a nicer / more descriptive UI
    public String toString() {
        return "${name_of_client_being_referred}"
    }
}
