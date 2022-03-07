package com.kengamis

import grails.gorm.services.Service

@Service(ProgramStaff)
interface ProgramStaffService {

    ProgramStaff get(Serializable id)

    List<ProgramStaff> list(Map args)

    Long count()

    void delete(Serializable id)

    ProgramStaff save(ProgramStaff programStaff)

}