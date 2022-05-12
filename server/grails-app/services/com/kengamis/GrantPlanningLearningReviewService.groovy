package com.kengamis

import grails.gorm.services.Service

@Service(GrantPlanningLearningReview)
interface GrantPlanningLearningReviewService {

    GrantPlanningLearningReview get(Serializable id)

    List<GrantPlanningLearningReview> list(Map args)

    Long count()

    void delete(Serializable id)

    GrantPlanningLearningReview save(GrantPlanningLearningReview grantPlanningLearningReview)

}