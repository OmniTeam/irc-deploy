package com.kengamis

class ReportForm {

    String id
    String groupId
    String processInstanceId
    String partnerSetupId
    String partnerId
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
        processInstanceId nullable: true
        partnerSetupId nullable: true
    }
}
