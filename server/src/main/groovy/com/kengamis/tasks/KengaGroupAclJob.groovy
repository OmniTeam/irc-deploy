package com.kengamis.tasks

import com.kengamis.AppHolder
import com.kengamis.Form
import com.kengamis.KengaGroupsService
import com.kengamis.acl.KengaAclTableRecordIdentity
import com.kengamis.acl.KengaDataTable
import groovy.util.logging.Log4j

@Log4j
class KengaGroupAclJob extends Script {

    KengaGroupsService kengaGroupsService = AppHolder.bean(KengaGroupsService)

    @Override
    Object run() {
        log.info("starting job for KengaGroupAclJob===============")
        createKengaDataTablesFrmForm()
        KengaDataTable.list().each { kengaDataTable ->
            generateKengaAclRecordIdentities(kengaDataTable)
        }
        Form.list().each { form ->
            def tableName = form.name

        }
        log.info("KengaGroupAclJob finished running==============")
    }

    def createKengaDataTablesFrmForm() {
        def tables = AppHolder.withMisSql {
            rows("SHOW TABLES".toString()).collect {it.Tables_in_kengamis}
        }

        tables.each {tab ->
                if (tableExists(tab.toString())) {
                    KengaDataTable.findByTableName(tab.toString())?: new KengaDataTable(tableName: tab, idLabel: '__id').save(flush: true, failOnError: true)
                }
        }

        /*Form.list().each { form ->
            def tableName = form.name
            if(tableExists(tableName)){
                KengaDataTable.findByTableName(form.name)?:new KengaDataTable(tableName: tableName, idLabel: '__id').save(flush: true, failOnError: true)
            }
        }*/
    }

    def generateKengaAclRecordIdentities(KengaDataTable kengaDataTable) {
        def records = AppHolder.withMisSqlNonTx {
            rows("select __id from ${kengaDataTable.tableName}".toString())
        }

        records.each { record ->
            KengaAclTableRecordIdentity.findByDataTableRecordId(record."$kengaDataTable.idLabel") ?: new KengaAclTableRecordIdentity(
                    kengaDataTable: kengaDataTable,
                    dataTableRecordId: record."$kengaDataTable.idLabel"?:"__id"
            ).save(flush: true, failOnError: true)
        }
    }

    boolean tableExists(String tableName) {
        def result = AppHolder.withMisSqlNonTx {
            rows("SHOW TABLES LIKE '$tableName'".toString())
        }
        return !result.isEmpty()
    }
}
