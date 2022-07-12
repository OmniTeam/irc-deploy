package com.kengamis

import grails.gorm.services.Service

@Service(PartnerSetupDisbursementPlan)
interface PartnerSetupDisbursementPlanService {

    PartnerSetupDisbursementPlan get(Serializable id)

    List<PartnerSetupDisbursementPlan> list(Map args)

    Long count()

    void delete(Serializable id)

    PartnerSetupDisbursementPlan save(PartnerSetupDisbursementPlan partnerSetupDisbursementPlan)

}