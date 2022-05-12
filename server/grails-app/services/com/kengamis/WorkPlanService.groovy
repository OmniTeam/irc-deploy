package com.kengamis

import grails.gorm.services.Service

@Service(WorkPlan)
interface WorkPlanService {

    WorkPlan get(Serializable id)

    List<WorkPlan> list(Map args)

    Long count()

    void delete(Serializable id)

    WorkPlan save(WorkPlan workPlan)

}