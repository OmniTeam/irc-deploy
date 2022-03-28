package com.kengamis

class ReportForm {

    String id
    String groupId
    String processId
    String taskId
    String taskDefinitionKey
    String userId
    String reportValues
    String status
    Date dateCreated
    Date lastUpdated

    static mapping = {
        id generator: 'uuid2'
    }
    static constraints = {
        groupId nullable: true
    }
}
