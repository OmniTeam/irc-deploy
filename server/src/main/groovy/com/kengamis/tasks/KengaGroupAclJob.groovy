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
            if(kengaDataTable.tableName != 'kenga_data_table'){
                generateKengaAclRecordIdentities(kengaDataTable)
            }
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
                    String idLabel = "id"
                    if(tab.toString().startsWith("__")){
                        idLabel = "__id"
                    }
                    def dataTable = KengaDataTable.findByTableName(tab.toString()) ?: new KengaDataTable(tableName: tab, idLabel: idLabel)
                    dataTable.idLabel = idLabel
                    dataTable.save(flush: true, failOnError: true)
                }
        }

    }

    def generateKengaAclRecordIdentities(KengaDataTable kengaDataTable) {
        try {
            def records = AppHolder.withMisSqlNonTx {
                def query = "select $kengaDataTable.idLabel from ${kengaDataTable.tableName}"
                log.info(query)
                rows(query.toString())
            }

            records.each { record ->
                if (!(KengaAclTableRecordIdentity.findByDataTableRecordId(record."$kengaDataTable.idLabel"))){
                   def createdAcl = new KengaAclTableRecordIdentity(
                            kengaDataTable: kengaDataTable,
                            dataTableRecordId: record."$kengaDataTable.idLabel"?:"__id"
                    ).save(flush: true, failOnError: true)
//
                }
            }
        } catch (Exception ex) {
            log.error(ex.getMessage())
        }
    }

    boolean tableExists(String tableName) {
        def result = AppHolder.withMisSqlNonTx {
            rows("SHOW TABLES LIKE '$tableName'".toString())
        }
        return !result.isEmpty()
    }
}
