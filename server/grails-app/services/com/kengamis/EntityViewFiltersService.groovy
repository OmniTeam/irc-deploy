package com.kengamis

import grails.gorm.services.Service

@Service(EntityViewFilters)
interface EntityViewFiltersService {

    EntityViewFilters get(Serializable id)

    List<EntityViewFilters> list(Map args)

    Long count()

    void delete(Serializable id)

    EntityViewFilters save(EntityViewFilters entityViewFilters)

}