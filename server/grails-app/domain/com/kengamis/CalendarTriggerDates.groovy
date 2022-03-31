package com.kengamis

class CalendarTriggerDates {

    String id
    String partnerSetupId
    String period
    String startDate
    String endDate
    Date dateCreated
    Date lastUpdated

    static mapping = {
        id generator: 'uuid2'
    }
    static constraints = {
    }
}
