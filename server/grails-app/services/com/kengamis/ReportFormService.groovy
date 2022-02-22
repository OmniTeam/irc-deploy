package com.kengamis

import grails.gorm.services.Service

@Service(ReportForm)
interface ReportFormService {

    ReportForm get(Serializable id)

    List<ReportForm> list(Map args)

    Long count()

    void delete(Serializable id)

    ReportForm save(ReportForm reportForm)

}