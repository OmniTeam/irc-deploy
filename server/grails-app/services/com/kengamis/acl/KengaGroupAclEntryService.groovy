package com.kengamis.acl

import grails.gorm.services.Service


class KengaGroupAclEntryService {

    KengaGroupAclEntry get(Serializable id) {
        return KengaGroupAclEntry.get(id)
    }

    List<KengaGroupAclEntry> list(Map args){
        return KengaGroupAclEntry.list(args)
    }

    Long count(){
        return KengaGroupAclEntry.count()
    }

    void delete(Serializable id){
        def kengaGroupAclEntry = get(id)
        kengaGroupAclEntry.delete(flush: true)
    }

    KengaGroupAclEntry save(KengaGroupAclEntry kengaGroupAclEntry){
        def saved = kengaGroupAclEntry.save(flush: true, failOnError: true)
        return saved
    }

}