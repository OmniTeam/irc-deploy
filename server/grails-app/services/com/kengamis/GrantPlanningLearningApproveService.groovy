package com.kengamis

import grails.gorm.services.Service

@Service(GrantPlanningLearningApprove)
interface GrantPlanningLearningApproveService {

    GrantPlanningLearningApprove get(Serializable id)

    List<GrantPlanningLearningApprove> list(Map args)

    Long count()

    void delete(Serializable id)

    GrantPlanningLearningApprove save(GrantPlanningLearningApprove grantPlanningLearningApprove)

}