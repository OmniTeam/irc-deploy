package com.kengamis

import grails.gorm.services.Service

@Service(Referral)
interface ReferralService {

    Referral get(Serializable id)

    List<Referral> list(Map args)

    Long count()

    void delete(Serializable id)

    Referral save(Referral referral)

}