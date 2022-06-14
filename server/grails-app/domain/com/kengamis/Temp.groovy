package com.kengamis

class Temp {

    String id
    String key
    String values

    static constraints = {
        values nullable: true
    }

    static mapping = {
        id generator: 'uuid2'
        values type: 'text'
    }
}
