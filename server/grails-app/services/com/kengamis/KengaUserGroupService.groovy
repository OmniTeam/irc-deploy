package com.kengamis

import grails.gorm.services.Service

@Service(KengaUserGroup)
interface KengaUserGroupService {

    KengaUserGroup get(Serializable id)

    List<KengaUserGroup> list(Map args)

    Long count()

    void delete(Serializable id)

    KengaUserGroup save(KengaUserGroup kengaUserGroup)

}