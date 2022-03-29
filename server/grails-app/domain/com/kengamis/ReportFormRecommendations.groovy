package com.kengamis

class ReportFormRecommendations {

    String id
    String groupId
    String processId
    String taskId
    String taskDefinitionKey
    String userId
    String content
    Date dateCreated

    static mapping = {
        id generator: 'uuid2'
    }
    static constraints = {
        groupId nullable: true
    }
}
