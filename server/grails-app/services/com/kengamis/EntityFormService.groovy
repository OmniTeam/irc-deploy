package com.kengamis

import grails.gorm.services.Service

@Service(EntityForm)
interface EntityFormService {

    EntityForm get(Serializable id)

    List<EntityForm> list(Map args)

    Long count()

    void delete(Serializable id)

    EntityForm save(EntityForm entityForm)

}