package com.kengamis

import grails.gorm.services.Service

@Service(GrantPlanningLearning)
interface GrantPlanningLearningService {

    GrantPlanningLearning get(Serializable id)

    List<GrantPlanningLearning> list(Map args)

    Long count()

    void delete(Serializable id)

    GrantPlanningLearning save(GrantPlanningLearning grantPlanningLearning)

}