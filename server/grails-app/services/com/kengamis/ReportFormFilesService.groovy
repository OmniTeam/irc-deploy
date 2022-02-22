package com.kengamis

import grails.gorm.services.Service

@Service(ReportFormFiles)
interface ReportFormFilesService {

    ReportFormFiles get(Serializable id)

    List<ReportFormFiles> list(Map args)

    Long count()

    void delete(Serializable id)

    ReportFormFiles save(ReportFormFiles reportFormFiles)

}