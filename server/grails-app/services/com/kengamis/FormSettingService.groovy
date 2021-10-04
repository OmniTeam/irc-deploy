package com.kengamis

import grails.gorm.services.Service

@Service(FormSetting)
interface FormSettingService {

    FormSetting get(Serializable id)

    List<FormSetting> list(Map args)

    Long count()

    void delete(Serializable id)

    FormSetting save(FormSetting formSetting)

}