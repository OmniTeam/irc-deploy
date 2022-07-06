package com.kengamis

import grails.gorm.services.Service

@Service(LongTermGrantApplication)
interface LongTermGrantApplicationService {

    LongTermGrantApplication get(Serializable id)

    List<LongTermGrantApplication> list(Map args)

    Long count()

    void delete(Serializable id)

    LongTermGrantApplication save(LongTermGrantApplication longTermGrantApplication)

}