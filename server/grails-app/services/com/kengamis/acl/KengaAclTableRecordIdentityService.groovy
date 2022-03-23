package com.kengamis.acl

import grails.gorm.services.Service


class KengaAclTableRecordIdentityService {

    KengaAclTableRecordIdentity get(Serializable id){
        return KengaAclTableRecordIdentity.get(id)
    }

    List<KengaAclTableRecordIdentity> list(Map args){
        return KengaAclTableRecordIdentity.list(args)
    }

    Long count(){
        return KengaAclTableRecordIdentity.count()
    }

    void delete(Serializable id){
        def kengaAclRecordIdentity = get(id)
        kengaAclRecordIdentity.delete(flush: true)
    }

    KengaAclTableRecordIdentity save(KengaAclTableRecordIdentity kengaAclTableRecordIdentity){
        def saved = kengaAclTableRecordIdentity.save(flush: true, failOnError: true)
        return saved
    }

}