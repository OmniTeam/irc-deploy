package com.kengamis

import grails.gorm.services.Service

@Service(Archive)
interface ArchiveService {

    Archive get(Serializable id)

    List<Archive> list(Map args)

    Long count()

    void delete(Serializable id)

    Archive save(Archive archive)

}