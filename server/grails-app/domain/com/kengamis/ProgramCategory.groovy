package com.kengamis

class ProgramCategory {

    String id
    String form
    String name
    String description
    Date dateCreated
    Date lastUpdated

    static belongsTo = [program: Program]
    static hasMany = [projectMilestones: ProjectMilestone]

    static constraints = {
        description nullable: true
        program nullable: true
    }

    static mapping = {
        id generator: 'uuid2'
    }

    @Override
    public String toString() {
        return "${name}"
    }
}
