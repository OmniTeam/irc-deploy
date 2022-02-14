package com.kengamis

import grails.gorm.services.Service

@Service(TagType)
interface TagTypeService {

    TagType get(Serializable id)

    List<TagType> list(Map args)

    Long count()

    void delete(Serializable id)

    TagType save(TagType tagType)

}