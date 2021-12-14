package com.kengamis

class TaskList {

    String id
    String inputParameters
    String outputParameters
    String status
    String formId
    String userGroupId
    String userId
    Date dateCreated
    Date lastUpdated

    static constraints = {
        formId nullable: false
    }
}
