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
    }

    @Override
    // Override toString for a nicer / more descriptive UI
    public String toString() {
        return "${nameOfRegister}"
    }
}
