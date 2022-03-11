package com.kengamis

import grails.gorm.services.Service

@Service(DataView)
interface DataViewService {

    DataView get(Serializable id)

    List<DataView> list(Map args)

    Long count()

    void delete(Serializable id)

    DataView save(DataView dataView)

}