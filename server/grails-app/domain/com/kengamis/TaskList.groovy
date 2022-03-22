package com.kengamis

class TaskList {

    String id
    String taskId
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

    static mapping = {
        id generator: 'uuid2'
        outputVariables type: 'text'
        inputVariables type: 'text'
    }
    static constraints = {
        formId nullable: true
    }
}
