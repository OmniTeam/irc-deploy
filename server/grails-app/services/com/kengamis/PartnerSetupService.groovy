package com.kengamis

import grails.gorm.services.Service

@Service(PartnerSetup)
interface PartnerSetupService {

    PartnerSetup get(Serializable id)

    List<PartnerSetup> list(Map args)

    Long count()

    void delete(Serializable id)

    PartnerSetup save(PartnerSetup partnerSetup)

}