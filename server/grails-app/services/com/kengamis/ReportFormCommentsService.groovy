package com.kengamis

import grails.gorm.services.Service

@Service(ReportFormComments)
interface ReportFormCommentsService {

    ReportFormComments get(Serializable id)

    List<ReportFormComments> list(Map args)

    Long count()

    void delete(Serializable id)

    ReportFormComments save(ReportFormComments reportFormComments)

}