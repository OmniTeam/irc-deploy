package com.kengamis.acl

import com.kengamis.AppHolder
import com.kengamis.KengaGroup
import grails.gorm.services.Service
import grails.gorm.transactions.Transactional


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
    @Transactional
    def saveGroupMappings(groupId, permission, queryArray){
        print(queryArray)
//        loop through the array and assign the acls per iteration
        queryArray.each{ it ->
            def formName = it.form
            def grpConditionQuery = it.groupConditionQuery

            def kengaGroup = KengaGroup.get(groupId)
//            def form = Form.get(formId)
            def kengaDataTable = KengaDataTable.findByTableName(formName)

            //query records
            def records = AppHolder.withMisSqlNonTx {
                def query = "select * from ${formName} ${grpConditionQuery}"
                log.info(query)
                rows(query.toString())
            }
            log.info("==============size${records.size()}")

            // gets the id label of the kengaDataTable may be __id or id
            // that's its significance
            def idLabel= kengaDataTable?.idLabel

            // create entries
            createAcls(records, groupId,permission, idLabel)

            // after creating the acls of the immediate group, create the function that checks for the parent of groups
            // until the last parent has no parent

            def parentGroupId = kengaGroup.parentGroup.collect{it.id}[0]

            while(parentGroupId !=null){
                // getting the parent object which will be used to create the acl
                def myCurrentObject = kengaGroup.get(parentGroupId)

                // create acl for the parent
                createAcls(records,myCurrentObject,permission,idLabel)

                // update the parent ID to the new parent of the current parent
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
            ).save(flush: true/*, failOnError: true*/)
        }
    }


}
