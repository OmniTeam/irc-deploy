package com.kengamis

class ProjectMilestone {

    String id
    String name
    String description
    String reportingQuery
    String dashboardQuery
    String reportingTable
    String dashboardTable
    Date dateCreated
    Date lastUpdated

    static constraints = {
        reportingQuery nullable: true
        dashboardQuery nullable: true
        description nullable: true
        reportingTable nullable: true
        dashboardTable nullable: true
    }

    static mapping = {
        id generator: 'uuid2'
        reportingQuery type: 'text'
        dashboardQuery type: 'text'
    }
}
