package com.kengamis

class EntityViewFields {

    static String TYPE_DISPLAY_FIELD = "Display Field"
    static String TYPE_FILTER_FIELD = "Filter Field"
    static String TYPE_KEY_FIELD = "Key Field"
    static String TYPE_RETURN_FIELD = "Return Field"
    static String TYPE_OTHER_FIELD = "Other"

    String id
    String name
    String fieldType
    String datatype
    int orderOfDisplay = 1
    int filterOrder = 1
    Date dateCreated
    Date lastUpdated

    static belongsTo = [entityView: EntityView]

    static constraints = {
        name nullable: false, validator: { value, object -> object.entityView.viewQuery.contains(value) ?: 'validation.entityView.missingViewColumn' }
        datatype nullable: false, inList: ['Text', 'Date', 'Number'], size: 1..255
    }
}
