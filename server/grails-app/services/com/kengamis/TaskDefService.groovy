package com.kengamis

import grails.gorm.services.Service

@Service(TaskDef)
interface TaskDefService {

    TaskDef get(Serializable id)

    List<TaskDef> list(Map args)

    Long count()

    void delete(Serializable id)

    TaskDef save(TaskDef taskDef)

}