package com.kengamis

import grails.gorm.services.Service

@Service(ReportFormPerformance)
interface ReportFormPerformanceService {

    ReportFormPerformance get(Serializable id)

    List<ReportFormPerformance> list(Map args)

    Long count()

    void delete(Serializable id)

    ReportFormPerformance save(ReportFormPerformance reportFormPerformance)

}