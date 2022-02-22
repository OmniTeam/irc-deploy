package com.kengamis

import grails.gorm.services.Service

@Service(ReportFormRecommendations)
interface ReportFormRecommendationsService {

    ReportFormRecommendations get(Serializable id)

    List<ReportFormRecommendations> list(Map args)

    Long count()

    void delete(Serializable id)

    ReportFormRecommendations save(ReportFormRecommendations reportFormRecommendations)

}