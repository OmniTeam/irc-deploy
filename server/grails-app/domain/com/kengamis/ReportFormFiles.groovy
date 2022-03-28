package com.kengamis

class ReportFormFiles {

    String id
    String groupId
    String processId
    String taskId
    String taskDefinitionKey
    String userId
    String path
    String name
    Date dateCreated

    static constraints = {
        groupId nullable: true
    }
}
