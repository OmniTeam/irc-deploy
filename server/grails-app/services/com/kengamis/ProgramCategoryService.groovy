package com.kengamis

import grails.gorm.services.Service

@Service(ProgramCategory)
interface ProgramCategoryService {

    ProgramCategory get(Serializable id)

    List<ProgramCategory> list(Map args)

    Long count()

    void delete(Serializable id)

    ProgramCategory save(ProgramCategory programCategory)

}