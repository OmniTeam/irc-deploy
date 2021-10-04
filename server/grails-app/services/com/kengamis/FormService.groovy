package com.kengamis

import grails.gorm.services.Service

@Service(Form)
interface FormService {

    Form get(Serializable id)

    List<Form> list(Map args)

    Long count()

    void delete(Serializable id)

    Form save(Form form)

}