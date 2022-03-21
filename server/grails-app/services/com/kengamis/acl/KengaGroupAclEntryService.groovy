package com.kengamis.acl

import grails.gorm.services.Service

@Service(KengaGroupAclEntry)
interface KengaGroupAclEntryService {

    KengaGroupAclEntry get(Serializable id)

    List<KengaGroupAclEntry> list(Map args)

    Long count()

    void delete(Serializable id)

    KengaGroupAclEntry save(KengaGroupAclEntry kengaGroupAclEntry)

}