package com.kengamis

import grails.gorm.services.Service

@Service(ActivityReport)
interface ActivityReportService {

    ActivityReport get(Serializable id)

    List<ActivityReport> list(Map args)

    Long count()

    void delete(Serializable id)

    ActivityReport save(ActivityReport activityReport)

}