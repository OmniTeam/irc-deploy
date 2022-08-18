package com.kengamis

class GrantReport {

    String id
    String grantId
    int grantAmount
    int grantAmountUtilised
    int balance
    String periodFrom
    String periodTo
    String dateReportSubmitted
    String reportAttachment
    String processInstanceId
    String definitionKey
    Date dateCreated
    Date lastUpdated

    static constraints = {
    }

    static mapping = {
        id generator: 'uuid2'
    }
}
