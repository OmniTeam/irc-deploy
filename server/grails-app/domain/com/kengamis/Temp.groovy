package com.kengamis

class Temp {

    String id
    String type
    String jsonValue
    Date dateCreated
    Date lastUpdated

    static constraints = {
        jsonValue nullable: true
    }

    static mapping = {
        id generator: 'uuid2'
        jsonValue type: 'text'
    }
}
