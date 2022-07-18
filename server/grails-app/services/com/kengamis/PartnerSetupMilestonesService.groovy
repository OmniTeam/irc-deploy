package com.kengamis

import grails.gorm.services.Service

@Service(PartnerSetupMilestones)
interface PartnerSetupMilestonesService {

    PartnerSetupMilestones get(Serializable id)

    List<PartnerSetupMilestones> list(Map args)

    Long count()

    void delete(Serializable id)

    PartnerSetupMilestones save(PartnerSetupMilestones partnerSetupMilestones)

}