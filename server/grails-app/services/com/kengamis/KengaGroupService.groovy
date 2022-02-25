package com.kengamis

import grails.gorm.services.Service

@Service(KengaGroup)
interface KengaGroupService {

    KengaGroup get(Serializable id)

    List<KengaGroup> list(Map args)

    Long count()

    void delete(Serializable id)

    KengaGroup save(KengaGroup kengaGroup)

}