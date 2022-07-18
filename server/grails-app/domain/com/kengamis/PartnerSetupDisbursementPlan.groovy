package com.kengamis

class PartnerSetupDisbursementPlan {

    String id
    String partnerSetupId

    String datePeriod
    String startDate
    String endDate
    String disbursement

    Date dateCreated
    Date lastUpdated

    static constraints = {
        disbursement nullable: true
    }

    static mapping = {
        id generator: 'uuid2'
    }
}
