package com.kengamis

class ProjectMilestone {

    String id
    String name
    String description
    String reportingQuery
    String dashboardQuery
    String reportingTable
    String dashboardTable
    String program
    String form
    Date dateCreated
    Date lastUpdated

    static belongsTo = [programCategory: ProgramCategory]

    static constraints = {
        reportingQuery nullable: true
        program nullable: true
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

    @Override
    public String toString() {
        return "${name}";
    }
}
