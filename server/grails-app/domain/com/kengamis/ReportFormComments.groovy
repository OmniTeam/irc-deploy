package com.kengamis

class ReportFormComments {

    String id
    String groupId
    String processId
    String taskId
    String taskDefinitionKey
    String userId
    String content
    String children
    Date dateCreated

    static mapping = {
        id generator: 'uuid2'
    }
    static constraints = {
    }
}
