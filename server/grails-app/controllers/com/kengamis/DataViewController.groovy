package com.kengamis

import com.kengamis.query.MetabaseHelper
import com.kengamis.query.QueryHelper
import grails.util.Holders
import grails.validation.ValidationException

import static com.kengamis.Util.constructFormTable
import static fuzzycsv.FuzzyCSVTable.tbl
import static fuzzycsv.FuzzyCSVTable.toCSV
import static org.springframework.http.HttpStatus.CREATED
import static org.springframework.http.HttpStatus.NOT_FOUND
import static org.springframework.http.HttpStatus.NO_CONTENT
import static org.springframework.http.HttpStatus.OK
import static org.springframework.http.HttpStatus.UNPROCESSABLE_ENTITY

import grails.gorm.transactions.ReadOnly
import grails.gorm.transactions.Transactional

@ReadOnly
class DataViewController {

    DataViewService dataViewService
    def springSecurityService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond dataViewService.list(params), model:[dataViewCount: dataViewService.count()]
    }

    def show(String id) {
        respond dataViewService.get(id)
    }

    @Transactional
    def save(DataView dataView) {
        if (dataView == null) {
            render status: NOT_FOUND
            return
        }
        if (dataView.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond dataView.errors
            return
        }

        try {
            dataViewService.save(dataView)
            createDataView(dataView)
        } catch (ValidationException e) {
            respond dataView.errors
            return
        }

        respond dataView, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(DataView dataView) {
        if (dataView == null) {
            render status: NOT_FOUND
            return
        }
        if (dataView.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond dataView.errors
            return
        }

        try {
            dataViewService.save(dataView)
            createDataView(dataView)
        } catch (ValidationException e) {
            respond dataView.errors
            return
        }

        respond dataView, [status: OK, view:"show"]
    }

    @Transactional
    def delete(String id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        dataViewService.delete(id)

        render status: NO_CONTENT
    }

    def createDataView(DataView dataView) {
        if (dataView.viewQuery) {
            def query = "create or replace view ${dataView.tableName} as ${dataView.viewQuery}".toString()
            AppHolder.withMisSqlNonTx {
                execute(query)
            }
        }
    }

    def dataViewRunNow() {
        def dataViewData
        def viewQuery = request.getParameter('params')
        try {
            def query = "${viewQuery}".toString()
            def data = AppHolder.withMisSql {
                toCSV(it, query)
            }.csv

            def dataMapList = tbl(data).toMapList()
            def headers = dataMapList.get(0).keySet()
            dataViewData = [dataList: dataMapList, headerList: headers]
        }
        catch (Exception e) {
            log.error("Error fetching data", e)
            dataViewData = [dataList: [], headerList: []]
        }
        respond dataViewData
    }

    def getDataViewData() {
        def dataViewData
        def id = params.id as String
        def dataView = DataView.get(id)
        try {
            def qh = new QueryHelper(params, springSecurityService.currentUser as User)
            def query = """
                SELECT * FROM ${dataView.tableName}
            """.toString()
            def data = AppHolder.withMisSql {
                toCSV(it, query)
            }.csv

            def dataMapList = tbl(data).toMapList()
            def headers = dataMapList.get(0).keySet()
            dataViewData = [dataList: dataMapList, headerList: headers, name: dataView.name, dataView: dataView]
        }
        catch (Exception e) {
            log.error("Error fetching data", e)
            dataViewData = [dataList: [], headerList: []]
        }
        respond dataViewData
    }

    def syncViewToMetabase() {
        def message = ["Data View Successfully Synced to Metabase"]
        def id = params.id as String
        def dataView = DataView.get(id)
        def misDb = Holders.grailsApplication.config.mis.database as String
        def study = Study.findByCentralId('9')
        if (study) {
            def metabaseDb = "metabase_${constructFormTable(study.name)}"
            AppHolder.withMisSqlNonTx { executeUpdate("CREATE DATABASE IF NOT EXISTS ${metabaseDb}".toString()) }
            exportDataView(misDb, metabaseDb, dataView)
        }
        respond message
    }

    def exportDataView(def misDb, def metabaseDb, DataView dataView) {
        MetabaseHelper metabaseHelper = new MetabaseHelper()
        def tableName = dataView.tableName as String
        def query = """
                           SHOW COLUMNS FROM $tableName
                        """
        log.info("query view definition: ${query}")
        def tableStructure = AppHolder.withMisSqlNonTx {
            rows(query.toString())
        }
        println(tableStructure)
        metabaseHelper.createTable(metabaseDb, tableName, tableStructure)
        metabaseHelper.insertDataIntoTable(misDb, metabaseDb, tableName)
    }

}
