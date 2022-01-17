package com.kengamis

import grails.gorm.services.Service

@Service(EntityFields)
interface EntityFieldsService {

    EntityFields get(Serializable id)

    List<EntityFields> list(Map args)

    Long count()

    void delete(Serializable id)

    EntityFields save(EntityFields entityFields)

}