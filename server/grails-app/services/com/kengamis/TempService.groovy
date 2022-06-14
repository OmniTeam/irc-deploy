package com.kengamis

import grails.gorm.services.Service

@Service(Temp)
interface TempService {

    Temp get(Serializable id)

    List<Temp> list(Map args)

    Long count()

    void delete(Serializable id)

    Temp save(Temp temp)

}