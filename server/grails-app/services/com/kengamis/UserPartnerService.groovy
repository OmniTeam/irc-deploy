package com.kengamis

import grails.gorm.services.Service

@Service(UserPartner)
interface UserPartnerService {

    UserPartner get(Serializable id)

    List<UserPartner> list(Map args)

    Long count()

    void delete(Serializable id)

    UserPartner save(UserPartner userPartner)

}