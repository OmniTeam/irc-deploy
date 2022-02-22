package com.kengamis

import grails.gorm.services.Service

@Service(TaskList)
interface TaskListService {

    TaskList get(Serializable id)

    List<TaskList> list(Map args)

    Long count()

    void delete(Serializable id)

    TaskList save(TaskList taskList)

}