package com.kengamis

class EntityFormFieldMap {

    String id
    String formField
    String formFieldType
    String entityField
    String entityFieldType
    Date	dateCreated
    Date	lastUpdated

    static	belongsTo	= [entityForm: EntityForm]

    static constraints = {
        formField nullable: false
        entityField nullable: false
    }
}
