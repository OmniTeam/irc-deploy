package com.kengamis

class TaskList {

    String id
    String inputVariables
    String outputVariables
    String status
    String formId
    String groupId
    String userId
    String taskName
    String processInstanceId
    String processDefKey
    String synced
    String taskDefinitionKey
    Date dateCreated
    Date lastUpdated

    static constraints = {
        formId nullable: false
    }
}
