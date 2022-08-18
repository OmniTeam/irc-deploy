package com.kengamis

import grails.gorm.services.Service

@Service(PartnerSetupBudget)
interface PartnerSetupBudgetService {

    PartnerSetupBudget get(Serializable id)

    List<PartnerSetupBudget> list(Map args)

    Long count()

    void delete(Serializable id)

    PartnerSetupBudget save(PartnerSetupBudget partnerSetupBudget)

}