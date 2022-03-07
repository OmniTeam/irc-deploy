package com.kengamis

class ProgramStaff {

    String id
    String name
    String email
    String nameContactPerson
    String personContact
    Date dateCreated
    Date lastUpdated

    static belongsTo = [program: Program]

    static constraints = {
        email nullable: true
        nameContactPerson nullable: true
        personContact nullable: true
    }

    static mapping = {
        id generator: 'uuid2'
    }

    @Override
    public String toString() {
        return "${name}"
    }
}
