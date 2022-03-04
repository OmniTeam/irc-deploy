package com.kengamis

import grails.gorm.services.Service

@Service(ProgramPartner)
interface ProgramPartnerService {

    ProgramPartner get(Serializable id)

    List<ProgramPartner> list(Map args)

    Long count()

    void delete(Serializable id)

    ProgramPartner save(ProgramPartner programPartner)

}