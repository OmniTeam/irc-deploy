package com.kengamis

class EntityViewFilters {

    String id
    String name
    String description
    String filterQuery

    static belongsTo = [entityView: EntityView]

    static constraints = {
        filterQuery nullable: true
        description nullable: true
    }

    static mapping = {
        id generator: 'uuid2'
        filterQuery type: 'text'
    }
}
