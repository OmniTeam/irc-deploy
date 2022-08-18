package com.kengamis

import grails.gorm.services.Service

@Service(UserGroup)
interface UserGroupService {

    UserGroup get(Serializable id)

    List<UserGroup> list(Map args)

    Long count()

    void delete(Serializable id)

    UserGroup save(UserGroup userGroup)

}