package com.kengamis

class EntityFormFieldMap {

    String id
    String formField
    String entityField
    Date	dateCreated
    Date	lastUpdated

    static	belongsTo	= [entityForm: EntityForm]

    static constraints = {
        formField nullable: false
        entityField nullable: false
    }
}
