package com.kengamis.acl

import grails.gorm.services.Service

@Service(KengaDataTable)
interface KengaDataTableService {

    KengaDataTable get(Serializable id)

    List<KengaDataTable> list(Map args)

    Long count()

    void delete(Serializable id)

    KengaDataTable save(KengaDataTable kengaDataTable)

}