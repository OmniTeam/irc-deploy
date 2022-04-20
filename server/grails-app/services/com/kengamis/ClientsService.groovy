package com.kengamis

import grails.gorm.services.Service

@Service(Clients)
interface ClientsService {

    Clients get(Serializable id)

    List<Clients> list(Map args)

    Long count()

    void delete(Serializable id)

    Clients save(Clients clients)

}