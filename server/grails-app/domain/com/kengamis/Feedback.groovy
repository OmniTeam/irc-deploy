package com.kengamis

class Feedback {
    String id
    String dateFeedbackReceived
    String nameOfRegister
    String serialNumber
    String gender
    String age
    String staffDesignation
    String typeOfFeedback
    String currentStatusOfFeedback
    String location
    String projectSector
    String subSector
    String nameOfClient
    String remainAnonymous
    String nationalityStatus
    String clientType
    String preferredChannel
    String phoneNumber
    String feedbackCategory
    String feedbackPriority
    String feedbackReferredShared
    String feedbackInternallyExternally
    String referredPersonName
    String referredPersonPosition
    String referredOrganization
    String dateFeedbackReferredShared
    String responseTypeRequired
    String actionFollowupNeeded
    String inFeedbackRegistry
    String dateFeedbackClient
    String actionTaken
    String staffProvidedResponse
    String responseSummary
    String supervisor
    String dataEntryFocalPoint

    static mapping = {
        id generator: 'uuid2'
    }

    static constraints = {
        serialNumber nullable: true
        gender nullable: true
        age nullable: true
        dateFeedbackReceived nullable: true
        nameOfRegister nullable: true
        staffDesignation nullable: true
        typeOfFeedback nullable: true
        currentStatusOfFeedback nullable: true
        location nullable: true
        projectSector nullable: true
        subSector nullable: true
        nameOfClient nullable: true
        remainAnonymous nullable: true
        nationalityStatus nullable: true
        clientType nullable: true
        preferredChannel nullable: true
        phoneNumber nullable: true
        feedbackCategory nullable: true
        feedbackPriority nullable: true
        feedbackReferredShared nullable: true
        feedbackInternallyExternally nullable: true
        referredPersonName nullable: true
        referredPersonPosition nullable: true
        referredOrganization nullable: true
        dateFeedbackReferredShared nullable: true
        responseTypeRequired nullable: true
        actionFollowupNeeded nullable: true
        inFeedbackRegistry nullable: true
        dateFeedbackClient nullable: true
        actionTaken nullable: true
        staffProvidedResponse nullable: true
        responseSummary nullable: true
        supervisor nullable: true
        dataEntryFocalPoint nullable: true
    }

    @Override
    // Override toString for a nicer / more descriptive UI
    public String toString() {
        return "${nameOfRegister}"
    }
}
