package com.kengamis

import grails.gorm.services.Service

@Service(QueryTable)
interface QueryTableService {

    QueryTable get(Serializable id)

    List<QueryTable> list(Map args)

    Long count()

    void delete(Serializable id)

    QueryTable save(QueryTable queryTable)

}