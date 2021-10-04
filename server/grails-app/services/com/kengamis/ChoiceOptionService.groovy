package com.kengamis

import grails.gorm.services.Service

@Service(ChoiceOption)
interface ChoiceOptionService {

    ChoiceOption get(Serializable id)

    List<ChoiceOption> list(Map args)

    Long count()

    void delete(Serializable id)

    ChoiceOption save(ChoiceOption choiceOption)

}