package com.kengamis

import com.kengamis.query.QueryHelper
import grails.core.GrailsApplication
import grails.rest.*
import grails.converters.*

class DataController {
	static responseFormats = ['json', 'xml']

    def dataService
    def springSecurityService
    GrailsApplication grailsApplication

    def index(Integer max) {
        def formData
        params.max = Math.min(max ?: 50, 100)
        try {
            def study = Study.findByCentralId('6')
            params.currentStudy = study.id as String
            def dataList = dataService.listAll(params)
            def q = new QueryHelper(params, springSecurityService.currentUser as User)
            def resultList = []
            dataList.each {form_data ->
                def formDataValues = form_data.allFormDataValues
                def record = [:]
                formDataValues.each { record["${it.formSetting.field}"] = it.humanReadableValue }
                resultList << record
            }
            formData = [headerList: q.headers, resultList: resultList, resultListCount: q.count, formtable: q.formTable, filters: q.filters, form: q.form]
        } catch (Exception e) {
            flash.error = "Data Might Not Be Available For This Form."
            log.error("Error fetching data", e)
            formData = [headerList: [], resultList: [], resultListCount: 0, formtable: params.formtable, filters: [], form: Form.findByName(params.formtable)]
        }
        respond formData
    }
}
