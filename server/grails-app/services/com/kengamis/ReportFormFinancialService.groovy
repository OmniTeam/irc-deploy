package com.kengamis

import grails.gorm.services.Service

@Service(ReportFormFinancial)
interface ReportFormFinancialService {

    ReportFormFinancial get(Serializable id)

    List<ReportFormFinancial> list(Map args)

    Long count()

    void delete(Serializable id)

    ReportFormFinancial save(ReportFormFinancial reportFormFinancial)

}