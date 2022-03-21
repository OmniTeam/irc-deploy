package com.kengamis.acl

import grails.gorm.services.Service

@Service(KengaAclTableRecordIdentity)
interface KengaAclTableRecordIdentityService {

    KengaAclTableRecordIdentity get(Serializable id)

    List<KengaAclTableRecordIdentity> list(Map args)

    Long count()

    void delete(Serializable id)

    KengaAclTableRecordIdentity save(KengaAclTableRecordIdentity kengaAclTableRecordIdentity)

}