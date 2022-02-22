package com.kengamis

class MisEntity {

    static String DEFAULT_QUERY = """sqlFilter.getProcessedSql("SELECT \$keyField as keyField \$otherFields  FROM \$tableName where 1 and #where# ")"""
    String id
    String name
    String tableName
    String prefix
    String prefixIncrementTable
    boolean enableTagging = false
    String entityTagTable
    Date dateCreated
    Date lastUpdated
    boolean ignoreUserContext = false

    static hasMany = [entityFields: EntityFields, entityForms: EntityForm, entityViews: EntityView, tagTypes: TagType]

    static constraints = {
        name nullable: false
        tableName nullable: false
        entityTagTable nullable: true
    }

    static mapping = {
        id generator: 'uuid2'
        entityFields cascade: "all-delete-orphan"
        entityFields sort: "orderOfDisplay", order: 'asc'
    }
}
