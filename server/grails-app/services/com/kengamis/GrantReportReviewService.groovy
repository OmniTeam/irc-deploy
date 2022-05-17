package com.kengamis

import grails.gorm.services.Service

@Service(GrantReportReview)
interface GrantReportReviewService {

    GrantReportReview get(Serializable id)

    List<GrantReportReview> list(Map args)

    Long count()

    void delete(Serializable id)

    GrantReportReview save(GrantReportReview grantReportReview)

}