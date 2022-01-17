package com.kengamis

import grails.gorm.services.Service

@Service(EntityView)
interface EntityViewService {

    EntityView get(Serializable id)

    List<EntityView> list(Map args)

    Long count()

    void delete(Serializable id)

    EntityView save(EntityView entityView)

}