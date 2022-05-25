package com.kengamis

import com.kengamis.query.FormData
import com.kengamis.query.QueryHelper
import com.kengamis.query.security.Permission
import grails.gorm.transactions.Transactional
import org.openxdata.markup.XformType

@Transactional
class DataService {

    def springSecurityService
    def kengaGroupsService

    List<FormData> listAll(def params) {
        def q = new QueryHelper(params, springSecurityService.currentUser as User)
        def filtered = isSuperUser()?q.data:kengaGroupsService.postFilter(q.data, Permission.READ,q.formTable)
        List<FormData> formDataList = filtered.collect {
            FormData.init(it.__id, q.formTable).lazyLoad()
        }
        return formDataList
    }

    List<FormData> exportListAll(def params) {
        def q = new QueryHelper(params, springSecurityService.currentUser as User)
        List<FormData> formDataList = q.data.collect {
            FormData.init(it.__id, q.formTable).exportLazyLoad()
        }
        return formDataList
    }

    def getGPSColumn(def formTable) {
        def form = Form.findByName(formTable)
        def formSetting = FormSetting.findByFormAndXformType(form, XformType.GPS.value)
        if (formSetting) {
            return formSetting.field
        }
        else {
            return ""
        }
    }

    boolean isSuperUser(){
        def user = springSecurityService.currentUser as User
         return user.hasAnyRole('ROLE_SUPER_ADMIN')
    }
}
