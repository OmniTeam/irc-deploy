package com.kengamis

import com.kengamis.query.QueryHelper
import grails.validation.ValidationException

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
        def viewQuery = params.query as String
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
}
