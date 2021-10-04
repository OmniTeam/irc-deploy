package com.kengamis

import grails.gorm.services.Service

@Service(RequestMap)
interface RequestMapService {

    RequestMap get(Serializable id)

    List<RequestMap> list(Map args)

    Long count()

    void delete(Serializable id)

    RequestMap save(RequestMap requestMap)

}