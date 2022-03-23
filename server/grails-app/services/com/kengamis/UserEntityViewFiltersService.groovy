package com.kengamis

import grails.gorm.services.Service

@Service(UserEntityViewFilters)
interface UserEntityViewFiltersService {

    UserEntityViewFilters get(Serializable id)

    List<UserEntityViewFilters> list(Map args)

    Long count()

    void delete(Serializable id)

    UserEntityViewFilters save(UserEntityViewFilters userEntityViewFilters)

}