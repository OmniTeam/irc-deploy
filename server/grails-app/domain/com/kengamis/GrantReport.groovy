package com.kengamis

class GrantReport {

    String id
    String grantId
    int grantAmount
    int grantAmountUtilised
    int amountTransferred
    int balance
    String periodFrom
    String periodTo
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
