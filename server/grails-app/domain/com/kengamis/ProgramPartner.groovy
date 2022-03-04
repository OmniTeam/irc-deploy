package com.kengamis

class ProgramPartner {

    String id
    String name
    String leadCluster
    String postalAddress
    String acronym
    String email
    String organisation
    String website
    String legal
    String country
    String nameContactPerson
    String city
    String physicalAddress
    Date dateCreated
    Date lastUpdated

    static belongsTo = [program: Program]

    static constraints = {
        leadCluster nullable: true
        postalAddress nullable: true
        acronym nullable: true
        email nullable: true
        organisation nullable: true
        website nullable: true
        legal nullable: true
        country nullable: true
        nameContactPerson nullable: true
        city nullable: true
        physicalAddress nullable: true
    }

    static mapping = {
        id generator: 'uuid2'
    }

    @Override
    public String toString() {
        return "${name}"
    }
}
