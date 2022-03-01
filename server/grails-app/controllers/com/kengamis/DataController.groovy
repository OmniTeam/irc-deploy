package com.kengamis

import com.kengamis.exporter.DataExporter
import com.kengamis.query.FormData
import com.kengamis.query.FormDataValue
import com.kengamis.query.QueryHelper
import grails.core.GrailsApplication
import grails.io.IOUtils
import grails.rest.*
import grails.converters.*
import grails.util.Holders
import groovy.sql.Sql
import org.openxdata.markup.XformType

import static com.kengamis.AppHolder.withMisSql
import static com.kengamis.Util.constructFormTable
import static com.kengamis.Util.escapeField
import static fuzzycsv.FuzzyCSVTable.toCSV

class DataController {
    static responseFormats = ['json', 'xml']

    def dataService
    def springSecurityService
    GrailsApplication grailsApplication

    def index(Integer max) {
        def formData = []
        try {
            def dataList = dataService.listAll(params)
            def q = new QueryHelper(params, springSecurityService.currentUser as User)
            def resultList = []
            dataList.each { form_data ->
                def formDataValues = form_data.allFormDataValues
                def record = [:]
                formDataValues.each { record["${it.formSetting.field}"] = it.humanReadableValue }
                resultList << record
            }
            def gpsCoordinates = getGpsPoints(params)
            def formGraphData = getFormGraphData(params)
            formData = [headerList    : q.headers, resultList: resultList, resultListCount: q.count, formtable: q.formTable,
                        filters       : q.filters, form: q.form, numberOfQuestions: q.formQuestions.size(),
                        gpsCoordinates: gpsCoordinates, formDataCollectors: q.formDataCollectors, formGraphData: formGraphData]
        } catch (Exception e) {
            flash.error = "Data Might Not Be Available For This Form."
            log.error("Error fetching data", e)
            formData = [headerList   : [], resultList: [], resultListCount: 0, formtable: params.formtable,
                        filters      : [], form: Form.findByName(params.formtable), gpsCoordinates: [], formDataCollectors: [],
                        formGraphData: []]
        }
        respond formData
    }

    def getFormDataRecord() {
        def formTable = params.formtable
        def recordId = params.id
        def formData = FormData.load(recordId, formTable)
        def formDataRecord = []
        formData.allFormDataValues.each { fd ->
            FormDataValue formDataValue = fd
            if (formDataValue.humanReadableValue) {
                if (!formDataValue.isMetaColumn()) {
                    if (formDataValue.formSetting.xformType == XformType.SELECT.value) {
                        if (formDataValue.multiSelectOptions.size() > 0) {
                            formDataRecord << [xformtype: formDataValue.formSetting.xformType, question: formDataValue.label, value: formDataValue.multiSelectOptions]
                        }
                    }
                    else if (formDataValue.formSetting.xformType == XformType.REPEAT.value) {
                        def headers = formDataValue.repeatHeaders
                        def resultList = formDataValue.repeatData
                        if (headers.size() > 0) {
                            formDataRecord << [xformtype: formDataValue.formSetting.xformType, question: formDataValue.label, value: [headerList: headers, resultList: resultList]]
                        }
                    }
                    else {
                        formDataRecord << [xformtype: formDataValue.formSetting.xformType, question: formDataValue.label, value: formDataValue.humanReadableValue]
                    }
                }
            }
        }
        respond formDataRecord
    }

    def getGpsPoints(def params) {
        def columnName = dataService.getGPSColumn(params.formtable)

        if (!columnName) {
            flash.message = "This Data Has No Mappable Data"
            return Collections.EMPTY_LIST
        }

        def qh = new QueryHelper(params, springSecurityService.currentUser as User)
        def points = withMisSql {
            if (qh.whereClause) {
                rows("select __id, replace(trim(replace(replace(replace($columnName, 'POINT', ''), '(', ''), ')', '')), ' ', ',') as point from ${escapeField params.formtable} where ($columnName is not null) and ($qh.whereClause)  limit $qh.maxRows offset $qh.offset".toString())
            } else {
                rows("select __id, replace(trim(replace(replace(replace($columnName, 'POINT', ''), '(', ''), ')', '')), ' ', ',') as point from ${escapeField params.formtable} where ($columnName is not null) limit $qh.maxRows offset $qh.offset".toString())
            }
        }

        if (log.traceEnabled) log.trace(points)
        return points.collect { [__id: it['__id'], point: it['point'].toString().split(",")] }
    }

    def getPointDetails() {
        def id = params.id as String
        def formTableName = params.formtable as String

        Form form = Form.findByName(formTableName)

        def mapFields = form.formSettings.findAll { it.viewOnMap }.sort { it.orderOfDisplayInTable }

        if (!mapFields) {
            mapFields = form.formSettings.take(6)
        }

        def fd = FormData.init(id, form)

        Map<String, Object> data = [:]

        for (mf in mapFields) {
            data[mf.displayName] = fd.getDataFor(mf.field).humanReadableValue
        }
        respond data
    }

    def getFormGraphData(params) {
        def formTableName = params.formtable as String
        Form form = Form.findByName(formTableName)
        def qh = new QueryHelper(EnumSet.noneOf(QueryHelper.Config), params, springSecurityService.currentUser as User)
        def query = """
                SELECT submitterName as 'user',
                     COUNT(submitterName) as 'count',
                     submissionDate as 'date'
                from ${escapeField(constructFormTable(form.name))}
                WHERE ${qh.getWhereClause('1')}
                GROUP BY submitterName,submissionDate """.toString()
        def records = withMisSql { rows(query) }
        return records
    }

    def getExportFormData() {
        def formtable = params.formtable as String
        def dataExporter = new DataExporter(formtable, params)
        def exportedData = dataExporter.exportToExcel()
        def fileName = dataExporter.setFileName()
        def response = [data: exportedData, file: fileName]
        respond response
    }

    def getFormDataImage() {
        def path = params.path
        def baseFolder = Holders.grailsApplication.config.imageFolder
        def imageFilePath = (baseFolder + path) as String
        def file = new File(imageFilePath)
        if (file.exists()) {
            IOUtils.copy(file.newDataInputStream(), response.outputStream)
            response.outputStream.flush()
        }
        else {
            render([msg: "File doesnt exist", status: 500] as JSON)
        }
    }
}
