package com.kengamis.tasks

import com.kengamis.AppHolder
import com.kengamis.DataView
import com.kengamis.Study
import com.kengamis.query.MetabaseHelper
import grails.util.Holders
import groovy.util.logging.Log4j

import static com.kengamis.Util.*


@Log4j
class MetabaseQueryImportJob extends Script {

    @Override
    Object run() {
        def misDb = Holders.grailsApplication.config.mis.database as String
        def study = Study.findByCentralId('8')
        if (study) {
            def metabaseDb = "metabase_${constructFormTable(study.name)}"
            AppHolder.withMisSqlNonTx { executeUpdate("CREATE DATABASE IF NOT EXISTS ${metabaseDb}".toString()) }
            exportDataViews(misDb, metabaseDb)
        }
        return null
    }

    private void exportDataViews(def misDb, def metabaseDb) {
        MetabaseHelper metabaseHelper = new MetabaseHelper()

        def dataViews = DataView.findAll()
        dataViews.each { dataView ->
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
}
