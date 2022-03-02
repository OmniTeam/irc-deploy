package com.kengamis

import grails.gorm.services.Service

@Service(ProjectMilestone)
interface ProjectMilestoneService {

    ProjectMilestone get(Serializable id)

    List<ProjectMilestone> list(Map args)

    Long count()

    void delete(Serializable id)

    ProjectMilestone save(ProjectMilestone projectMilestone)

}