package com.kengamis

import grails.gorm.services.Service

@Service(Study)
interface StudyService {

    Study get(Serializable id)

    List<Study> list(Map args)

    Long count()

    void delete(Serializable id)

    Study save(Study study)

}