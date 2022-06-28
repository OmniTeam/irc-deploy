package com.kengamis

class ProgramPartner {

    String id
    String cluster
    String organisation
    String physicalAddress
    String organisationType
    String nameContactPerson
    String telephoneContactPerson
    String emailContactPerson
    String country
    String city
    String dataCollector
    String organisationsInvolved
    String areaOfOperation
    Date dateCreated
    Date lastUpdated

    static belongsTo = [program: Program]

    static constraints = {
        cluster nullable: true
        telephoneContactPerson nullable: true
        emailContactPerson nullable: true
        organisation nullable: true
        country nullable: true
        nameContactPerson nullable: true
        city nullable: true
        physicalAddress nullable: true
        areaOfOperation nullable: true
        organisationsInvolved nullable: true
        dataCollector nullable: true
    }

    static mapping = {
        id generator: 'uuid2'
        organisationsInvolved type: 'text'
    }

    @Override
    public String toString() {
        return "${cluster}"
    }
}
