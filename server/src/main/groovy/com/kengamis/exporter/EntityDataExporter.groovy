package com.kengamis.exporter

import com.kengamis.AppHolder
import com.kengamis.EntityFields
import com.kengamis.FormSetting
import com.kengamis.MisEntity
import com.kengamis.User
import com.sun.org.apache.regexp.internal.RE
import fuzzycsv.Fuzzy
import fuzzycsv.FuzzyCSV
import fuzzycsv.FuzzyCSVTable

import java.sql.ResultSet

class EntityDataExporter {
    String id
    Map params
    MisEntity misEntity
    User user

    EntityDataExporter(String id, Map params) {
        this.params = params
        this.id = id
        this.params.id = id
        init()
    }

    def init() {
        misEntity = MisEntity.get(id)
        user = AppHolder.currentUser()
    }

    def exportToExcel(def results) {
        def exportedData = []
        if (results.size() == 0) {
            exportedData = []
        }
        else {
            exportedData = getExportedData(results)
        }
        return exportedData
    }

    private List<EntityFields> getColumnHeaderSettings(rs) {
        def dbColumnHeaders = rs.header
        def headerSettings = dbColumnHeaders.collect { String dbField ->
            misEntity.findEntityField(dbField)
        }
        return headerSettings
    }

    def getExportedData(rs) {
        def result = []
        def mapList = FuzzyCSVTable.toCSV(rs)
        def headers = getColumnHeaderSettings(mapList)
        mapList.toMapList().each { record ->
            def eachRecord = [:]
            record.eachWithIndex{ rec, idx ->
                def header = headers.get(idx)
                if (header != null) {
                    eachRecord["${header.displayName}".replaceAll("(\n)","")] =  (rec.value ?: "")
                }
            }
            result << eachRecord
        }
        return result
    }

    def setFileName() {
        def name = misEntity.name
        return name
    }

}
