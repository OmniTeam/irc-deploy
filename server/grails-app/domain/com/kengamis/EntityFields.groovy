package com.kengamis

class EntityFields {

    static String TYPE_DISPLAY_FIELD = "Display Field"
    static String TYPE_FILTER_FIELD = "Filter Field"
    static String TYPE_KEY_FIELD = "Key Field"
    static String TYPE_OTHER_FIELD = "Other"

    String id
    String displayName
    String fieldName
    String fieldType = TYPE_DISPLAY_FIELD
    String dataType
    String sqlDataType
    String mandatory
    int orderOfDisplay = 1
    int filterOrder = 1
    Date	dateCreated
    Date	lastUpdated

    static	belongsTo	= [misEntity: MisEntity]

    static constraints = {
        fieldName nullable: false
        displayName nullable: false
        dataType nullable: false,inList: ['String','Date','Number', 'Boolean', 'Float'],size: 1..255
        sqlDataType nullable: false,inList: ['text','datetime','int', 'bit', 'double'],size: 1..255
    }


    String getFieldName() {
        return fieldName
    }
}
