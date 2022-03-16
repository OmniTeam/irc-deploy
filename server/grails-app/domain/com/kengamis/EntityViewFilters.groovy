package com.kengamis

class EntityViewFilters {

    String id
    String name
    String description
    String filterQuery

    static belongsTo = [entityView: EntityView, user: User]

    static constraints = {
        filterQuery nullable: true
        description nullable: true
        user nullable: true
    }

    static mapping = {
        id generator: 'uuid2'
        filterQuery type: 'text'
    }
}
