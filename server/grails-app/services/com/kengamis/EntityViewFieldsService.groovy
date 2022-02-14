package com.kengamis

import grails.gorm.services.Service

@Service(EntityViewFields)
interface EntityViewFieldsService {

    EntityViewFields get(Serializable id)

    List<EntityViewFields> list(Map args)

    Long count()

    void delete(Serializable id)

    EntityViewFields save(EntityViewFields entityViewFields)

}