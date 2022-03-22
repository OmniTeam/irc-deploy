package com.kengamis.acl

import grails.gorm.services.Service


class KengaDataTableService {

    KengaDataTable get(Serializable id){
        return KengaDataTable.get(id)
    }

    List<KengaDataTable> list(Map args){
        return KengaDataTable.list(args)
    }

    Long count(){
        return KengaDataTable.count()
    }

    void delete(Serializable id){
        def kengaDataTable = get(id)
        kengaDataTable.delete(flush: true)
    }

    KengaDataTable save(KengaDataTable kengaDataTable){
        def saved = kengaDataTable.save(flush: true, failOnError: true)
        return saved
    }

}