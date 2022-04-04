package com.kengamis

class UserPartner {

    String id
    User user
    ProgramPartner programPartner

    Date dateCreated
    Date lastUpdated

    static belongsTo = [user: User, programPartner: ProgramPartner]

    static mapping = {
        id generator: 'uuid2'
    }

    static constraints = {
        user unique: 'programPartner'
    }
}
