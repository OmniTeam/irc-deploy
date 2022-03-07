package com.kengamis

class Program {

    String id
    String title
    String description
    Date dateCreated
    Date lastUpdated

    static hasMany = [programCategories: ProgramCategory, programStaffs: ProgramStaff]

    static constraints = {
        description nullable: true
    }

    static mapping = {
        id generator: 'uuid2'
    }

    @Override
    public String toString() {
        return "${title}";
    }
}
