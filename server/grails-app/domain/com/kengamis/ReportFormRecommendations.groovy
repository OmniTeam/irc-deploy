package com.kengamis

class ReportFormRecommendations {

    String id
    String processInstanceId
    String taskId
    String taskDefinitionKey
    String userId
    String content
    Date dateCreated

    static mapping = {
        id generator: 'uuid2'
    }
    static constraints = {
    }
}
