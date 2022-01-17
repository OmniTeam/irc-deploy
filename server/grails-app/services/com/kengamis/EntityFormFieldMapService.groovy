package com.kengamis

import grails.gorm.services.Service

@Service(EntityFormFieldMap)
interface EntityFormFieldMapService {

    EntityFormFieldMap get(Serializable id)

    List<EntityFormFieldMap> list(Map args)

    Long count()

    void delete(Serializable id)

    EntityFormFieldMap save(EntityFormFieldMap entityFormFieldMap)

}