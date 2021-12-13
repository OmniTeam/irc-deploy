package com.kengamis

import grails.gorm.services.Service

@Service(MisEntity)
interface MisEntityService {

    MisEntity get(Serializable id)

    List<MisEntity> list(Map args)

    Long count()

    void delete(Serializable id)

    MisEntity save(MisEntity misEntity)

}