package com.kengamis

import com.kengamis.exporter.DataExporter
import com.kengamis.query.FormData
import com.kengamis.query.FormDataValue
import com.kengamis.query.QueryHelper
import grails.core.GrailsApplication
import grails.io.IOUtils
import grails.converters.*
import grails.util.Holders
import groovyx.net.http.RESTClient
import org.openxdata.markup.XformType
import wslite.http.auth.HTTPBasicAuthorization

import static com.kengamis.AppHolder.withMisSql
import static com.kengamis.AppHolder.withMisSqlNonTx
import static com.kengamis.Util.constructFormTable
import static com.kengamis.Util.escapeField

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

        def data = []
        for (mf in mapFields) {
            def map = [:]
            map['question'] = mf.displayName
            map['answer'] = fd.getDataFor(mf.field).humanReadableValue
            map['xformtype'] = mf.xformType
            data << map
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

    def getExportedFormData() {
        def formtable = params.formtable as String
        def dataExporter = new DataExporter(formtable, params)
        def exportedData = dataExporter.exportToExcel()
        def fileName = dataExporter.setFileName()
        def response = [data: exportedData, file: fileName]
        respond response
    }

    def getExportedZippedFormData() {
        def formtable = params.formtable as String
        def dataExporter = new DataExporter(formtable, params)
        def exportedData = dataExporter.exportToZipped()
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

    def loadIrcClientDataFrmFeed() {
        String url = "https://www.commcarehq.org"
        String username = "ccathy@omnitech.co.ug"
        String password = "omnitech123"
        def client = dataService.initRESTClient(url, username, password)
        def path = "/a/irc-re-build/api/v0.5/odata/cases/0a28cfd2343deecb911d1fc1ca19f97e/feed"
        def response
        try {
            response = client.get(path: path)
            assert response.statusCode == 200
            def resp =  response.json
            if(resp) {
                resp.value.each{record->
//                    insert into clients table
//                    TODO discuss with Cathy these fields
                    withMisSqlNonTx {
                        def query = """
                            insert into services(id,case_id,partner_name,date_of_service,
                            client_case_id,service_provided)
                            values(?,?,?,?,?,?)
                        """

                        executeUpdate(query.toString(),[UUID.randomUUID().toString(),record.caseid,record."Partner that provided service",
                        record."Date of service",record."client caseid",record."Service provided"])
                    }
                }
            }
            render([msg: "Success", status: 200] as JSON)
        } catch (Exception e) {
            e.printStackTrace()
            render([msg: "Failed", status: 500] as JSON)
        }
    }
    def loadIrcClientDataFrmFeed2() {
//        TODO these should be stored in an external file
        String url = "https://www.commcarehq.org"
        String username = "ccathy@omnitech.co.ug"
        String password = "omnitech123"
        def client = dataService.initRESTClient(url, username, password)
        def path = "/a/irc-re-build/api/v0.5/odata/cases/0a28cfd2343deecb911d1fc1ca19d3b0/feed"
        def response
        try {
            response = client.get(path: path)
            assert response.statusCode == 200
            def resp =  response.json
            if(resp) {
                resp.value.each{record->
//                    insert into clients table
//                    TODO discuss with Cathy these fields
//                    TODO check for duplicates
                    withMisSqlNonTx {
                        def query = """
                            insert into clients(id,partner_name,case_id,division,gender,date_of_registration,
                            district,parish,age_category,country_of_origin,disability,register_status)
                            values(?,?,?,?,?,?,?,?,?,?,?,?)
                        """
                        executeUpdate(query.toString(),[UUID.randomUUID().toString(),record."Partner name",record.caseid,record.Division,
                        record.Gender,record."Date of registration",record.District,record.Parish,record.Age,
                        record.Nationality,record."Have disability",record."Registered?"])
                    }
                }
            }
            render([msg: "Success", status: 200] as JSON)
        } catch (Exception e) {
            e.printStackTrace()
            render([msg: "Failed", status: 500] as JSON)
        }
    }
}
