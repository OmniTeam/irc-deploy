package com.kengamis.query

import groovy.sql.GroovyRowResult
import groovy.util.logging.Log4j

import static com.kengamis.AppHolder.withMysqlGeneral

@Log4j
class MetabaseHelper {

    static def createTable(def metabaseDb, def tableName, List<GroovyRowResult> tableStructure) {
        try {
            if (tableExists(tableName, metabaseDb)) {
                deleteTable(tableName, metabaseDb)
            }
            def createTableQuery = """
                    CREATE TABLE IF NOT EXISTS ${tableName} (
                    ${generateCreateTableSegments(tableStructure).join(',')}
                    )
            """
            withMysqlGeneral(metabaseDb) {
                execute(createTableQuery.toString())
            }
        } catch (Exception ex) {
            log.error(ex.getMessage())
            ex.printStackTrace()
        }

    }

    static def insertDataIntoTable(def misDb, def metabaseDb, def tableName) {
        def insertQuery = """
            INSERT INTO $tableName 
            SELECT ${tableName}.*,UUID() 
            FROM  ${misDb}.${tableName}
        """
        log.info(insertQuery.toString())

        withMysqlGeneral(metabaseDb) {
            execute(insertQuery.toString())
        }
    }

    static List<String> generateCreateTableSegments(List<GroovyRowResult> tableStructure) {
        def columnDef = []
        tableStructure.each {
            def attrs = "${it.Field} ${it.Type}"
            columnDef << attrs
        }

        columnDef << 'uid varchar(255) not null'
        columnDef << 'PRIMARY KEY (uid)'

        return columnDef
    }

    static boolean tableExists(String tableName, String metabaseDb) {
        def results = withMysqlGeneral(metabaseDb) { firstRow("SHOW TABLES LIKE '%$tableName%'".toString()) }
        return results != null
    }

    static def deleteTable(String tableName, String metabaseDb) {
        withMysqlGeneral(metabaseDb) { execute("DROP TABLE $tableName".toString()) }
    }
}
