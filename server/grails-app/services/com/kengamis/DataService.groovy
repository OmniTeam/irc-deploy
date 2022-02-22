package com.kengamis

import com.kengamis.query.FormData
import com.kengamis.query.QueryHelper
import com.omnitech.oxd.jooq.tables.records.FormDataRecord
import grails.gorm.transactions.Transactional
import org.jooq.DSLContext
import org.openxdata.markup.XformType

import static com.kengamis.Form.*

@Transactional
class DataService {

    def springSecurityService

    boolean hasAccessToTable(User user, String table) {
        def forms = listAllUserForms(user)
        def hasAccess = forms.any { it.name == table }
        return hasAccess
    }

    List<FormData> listAll(def params) {
        def q = new QueryHelper(params, springSecurityService.currentUser as User)
        List<FormData> formDataList = q.data.collect {
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
}
