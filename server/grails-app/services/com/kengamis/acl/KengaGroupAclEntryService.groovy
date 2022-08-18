package com.kengamis.acl

import com.kengamis.AppHolder
import com.kengamis.KengaGroup
import com.kengamis.QueryTable
import grails.gorm.services.Service
import grails.gorm.transactions.Transactional
import groovy.json.JsonSlurper


class KengaGroupAclEntryService {

    KengaGroupAclEntry get(Serializable id) {
        return KengaGroupAclEntry.get(id)
    }

    List<KengaGroupAclEntry> list(Map args){
        return KengaGroupAclEntry.list(args)
    }

    Long count(){
        return KengaGroupAclEntry.count()
    }

    void delete(Serializable id){
        def kengaGroupAclEntry = get(id)
        kengaGroupAclEntry.delete(flush: true)
    }

    KengaGroupAclEntry save(KengaGroupAclEntry kengaGroupAclEntry){
        def saved = kengaGroupAclEntry.save(flush: true, failOnError: true)
        return saved
    }
    /*@Transactional
    def saveGroupMappings(groupId, permission, queryArray){
        queryArray.each{ it ->
            def formName = it.form
            def grpConditionQuery = it.groupConditionQuery

            def kengaGroup = KengaGroup.get(groupId)
            def kengaDataTable = KengaDataTable.findByTableName(formName)
            def records = AppHolder.withMisSqlNonTx {
                def query = "select * from ${formName} ${grpConditionQuery}"
                log.info(query)
                rows(query.toString())
            }
            log.info("==============size${records.size()}")
            def idLabel= kengaDataTable?.idLabel
            // here add to the query table
            QueryTable.create(groupId,permission,records,idLabel)
//            createAcls(records, groupId,permission, idLabel)
            def parentGroupId = kengaGroup.parentGroup.collect{it.id}[0]
            while(parentGroupId !=null){
                def myCurrentObject = kengaGroup.get(parentGroupId)
                // here add to the query table
                QueryTable.create(myCurrentObject,permission,records,idLabel)
                createAcls(records,myCurrentObject,permission,idLabel)
                parentGroupId = myCurrentObject.parentGroup.collect {it.id}[0]
            }
        }
    }

    def createAcls(aclRecords,groupId, permissionNumber, idLabel){
        aclRecords.each { record ->
            def kengaAclTableRecordIdentity = KengaAclTableRecordIdentity.findByDataTableRecordId(record."$idLabel")
            new KengaGroupAclEntry(
                    kengaAclTableRecordIdentity: kengaAclTableRecordIdentity,
                    kengaGroup: groupId,
                    mask: permissionNumber
            ).save(flush: true*//*, failOnError: true*//*)
        }
    }*/

    static def createAclsForRecords() {
        QueryTable.all.each { qt ->
            def groupId = qt.kengaGroupId
            def permission = qt.permission
            def queryArray = new JsonSlurper().parseText(qt.query)
            def queryData = queryArray['queryData']
            print(queryData)
            queryData.each { it ->
                def formName = it['form']
                def grpConditionQuery = it['groupConditionQuery']
                def kengaGroup = KengaGroup.get(groupId)
                def kengaDataTable = KengaDataTable.findByTableName(formName as String)

                //query records
                def data = AppHolder.withMisSqlNonTx {
                    def query = "select * from ${formName} ${grpConditionQuery}"
                    log.info(query)
                    rows(query.toString())
                }
                log.info("==============size${data.size()}")

                if (data.size() > 0) {
                    def idLabel = kengaDataTable.idLabel
                    createAclsTaskList(data, groupId, permission, idLabel)
                    def parentGroupId = kengaGroup.parentGroup.collect { it.id }[0]

                    while (parentGroupId != null) {
                        // getting the parent object which will be used to create the acl
                        def myCurrentObject = kengaGroup.get(parentGroupId)

                        // create acl for the parent
                        createAclsTaskList(data, myCurrentObject, permission, idLabel)

                        // update the parent ID to the new parent of the current parent
                        parentGroupId = myCurrentObject.parentGroup.collect { it.id }[0]
                    }
                }


            }

        }

    }

    static def createAclsTaskList(aclRecords, groupId, permissionNumber, idLabel) {
        aclRecords.each { recordz ->
            def kengaAclTableRecordIdentity = KengaAclTableRecordIdentity.findByDataTableRecordId(recordz."$idLabel")
            def groupObject = KengaGroup.findById(groupId)
            if (!(KengaGroupAclEntry.findByKengaAclTableRecordIdentityAndKengaGroup(kengaAclTableRecordIdentity, groupObject))) {
                new KengaGroupAclEntry(
                        kengaAclTableRecordIdentity: kengaAclTableRecordIdentity,
                        kengaGroup: groupId,
                        mask: permissionNumber
                ).save(flush: true, failOnError: true)
            }

//            }
        }
    }


}
