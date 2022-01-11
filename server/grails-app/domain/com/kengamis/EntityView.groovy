package com.kengamis

class EntityView {

    static String DEFAULT_QUERY = """sqlFilter.getProcessedSql("SELECT \$keyField as keyField \$otherFields  FROM \$tableName where 1 and #where# ")"""

    String id
    String name
    String tableName
    String description
    String viewQuery
    boolean ignoreUserContext = false
    Date dateCreated
    Date lastUpdated

    static belongsTo = [misEntity: MisEntity]
    static hasMany = [viewFields: EntityViewFields]

    static mapping = {
        viewQuery type: 'text'
    }

    static constraints = {
        viewQuery nullable: true
        description nullable: true
        tableName nullable: false, validator: { value, object -> object.viewQuery.contains(value) ? true : "validation.entityView.tableMismatch" }
    }

    def String getKeyField(){
        return EntityViewFields.findByFieldTypeAndEntityView(EntityViewFields.TYPE_KEY_FIELD,this)?.name
    }
}
