package com.kengamis

import grails.gorm.services.Service

@Service(GrantProvideLearningGrant)
interface GrantProvideLearningGrantService {

    GrantProvideLearningGrant get(Serializable id)

    List<GrantProvideLearningGrant> list(Map args)

    Long count()

    void delete(Serializable id)

    GrantProvideLearningGrant save(GrantProvideLearningGrant grantProvideLearningGrant)

}