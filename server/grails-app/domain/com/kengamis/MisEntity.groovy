package com.kengamis

class MisEntity {

    String id
    String name
    String tableName
    Date dateCreated
    Date lastUpdated
    boolean ignoreUserContext = false

    static hasMany = [entityFields: EntityFields, entityForms: EntityForm, entityViews: EntityView]

    static constraints = {
        name nullable: false
        tableName nullable: false
    }

    static mapping = {
        entityFields cascade: "all-delete-orphan"
        entityFields sort: "orderOfDisplay", order: 'asc'
    }
}
