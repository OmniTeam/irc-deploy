package com.kengamis

class ReportFormFiles {

    String id
    String groupId
    String processInstanceId
    String taskId
    String taskDefinitionKey
    String userId
    String path
    String name
    Date dateCreated

    static mapping = {
        id generator: 'uuid2'
    }
    static constraints = {
        groupId nullable: true
    }
}
