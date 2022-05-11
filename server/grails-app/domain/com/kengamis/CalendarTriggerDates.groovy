package com.kengamis

class CalendarTriggerDates {

    String id
    String workPlanId
    String period
    String startDate
    String endDate
    Boolean started
    Boolean completed
    Date dateCreated
    Date lastUpdated

    static mapping = {
        id generator: 'uuid2'
    }
    static constraints = {
        started defaultValue: false
        completed defaultValue: false
    }
}
