package com.kengamis

import grails.gorm.services.Service

@Service(GrantReport)
interface GrantReportService {

    GrantReport get(Serializable id)

    List<GrantReport> list(Map args)

    Long count()

    void delete(Serializable id)

    GrantReport save(GrantReport grantReport)

}