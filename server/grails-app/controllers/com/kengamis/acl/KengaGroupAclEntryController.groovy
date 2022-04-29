package com.kengamis.acl

import com.kengamis.AppHolder
import com.kengamis.Form
import com.kengamis.KengaGroup
import grails.converters.JSON
import grails.validation.ValidationException
import static org.springframework.http.HttpStatus.CREATED
import static org.springframework.http.HttpStatus.NOT_FOUND
import static org.springframework.http.HttpStatus.NO_CONTENT
import static org.springframework.http.HttpStatus.OK
import static org.springframework.http.HttpStatus.UNPROCESSABLE_ENTITY

import grails.gorm.transactions.ReadOnly
import grails.gorm.transactions.Transactional

@ReadOnly
class KengaGroupAclEntryController {

    KengaGroupAclEntryService kengaGroupAclEntryService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond kengaGroupAclEntryService.list(params), model:[kengaGroupAclEntryCount: kengaGroupAclEntryService.count()]
    }

    def show(Long id) {
        respond kengaGroupAclEntryService.get(id)
    }

    @Transactional
    def save(KengaGroupAclEntry kengaGroupAclEntry) {
        if (kengaGroupAclEntry == null) {
            render status: NOT_FOUND
            return
        }
        if (kengaGroupAclEntry.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond kengaGroupAclEntry.errors
            return
        }

        try {
            kengaGroupAclEntryService.save(kengaGroupAclEntry)
        } catch (ValidationException e) {
            respond kengaGroupAclEntry.errors
            return
        }

        respond kengaGroupAclEntry, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(KengaGroupAclEntry kengaGroupAclEntry) {
        if (kengaGroupAclEntry == null) {
            render status: NOT_FOUND
            return
        }
        if (kengaGroupAclEntry.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond kengaGroupAclEntry.errors
            return
        }

        try {
            kengaGroupAclEntryService.save(kengaGroupAclEntry)
        } catch (ValidationException e) {
            respond kengaGroupAclEntry.errors
            return
        }

        respond kengaGroupAclEntry, [status: OK, view:"show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        kengaGroupAclEntryService.delete(id)

        render status: NO_CONTENT
    }

    @Transactional
    def saveGroupMappings(){
        def json=request.JSON
        def groupId = json.group
        def permission = json.permissions
        def queryArray = json.queryArray


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

            // create entries
//            createAcls(records, groupId,permission)
            records.each {record->
                def kengaAclTableRecordIdentity = KengaAclTableRecordIdentity.findByDataTableRecordId(record."$kengaDataTable.idLabel")
                new KengaGroupAclEntry(
                        kengaAclTableRecordIdentity: kengaAclTableRecordIdentity,
                        kengaGroup: kengaGroup,
                        mask: permission
                ).save(flush: true, failOnError: true)
            }

            // after creating the acls of the immediate group
            // create the function that checks for the parent of groups
            // until the last parent has no parent

            def parentGroupId = kengaGroup.parentGroup.collect{it.id}[0]

            while(parentGroupId !=null){
                // getting the parent object which will be used to create the acl
                def myCurrentObject = kengaGroup.get(parentGroupId)

                // create acl for the parent
//                createAcls(records,myCurrentObject,permission)
                records.each {record->
                    def kengaAclTableRecordIdentity = KengaAclTableRecordIdentity.findByDataTableRecordId(record."$kengaDataTable.idLabel")
                    new KengaGroupAclEntry(
                            kengaAclTableRecordIdentity: kengaAclTableRecordIdentity,
                            kengaGroup: myCurrentObject,
                            mask: permission
                    ).save(flush: true, failOnError: true)
                }

                // update the parent ID to the new parent of the current parent
                parentGroupId = myCurrentObject.parentGroup.collect {it.id}[0]

            }
        }
    }

    /*def createAcls(aclRecords,groupId, permissionNumber){
        aclRecords.each { record ->
            print('======')
            print(record)
            print('======')
            def currentIdLabel = KengaDataTable.idLabel
            def kengaAclTableRecordIdentity = KengaAclTableRecordIdentity.findByDataTableRecordId(record.currentIdLabel)
            new KengaGroupAclEntry(
                    kengaAclTableRecordIdentity: kengaAclTableRecordIdentity,
                    kengaGroup: groupId,
                    mask: permissionNumber
            ).save(flush: true, failOnError: true)
        }
    }*/

    def allMisTables() {
        def tables = AppHolder.withMisSqlNonTx {
            def query = "show tables;"
            rows(query)
        }

        render tables as JSON
    }

    def listAllACLS (){
        def acls = []
        KengaGroupAclEntry.all.each {aclEntry ->
            acls << [
                    id: aclEntry.id,
                    group: aclEntry.kengaGroup.name,
                    table: aclEntry.kengaAclTableRecordIdentity.kengaDataTable.tableName
            ]
        }
        respond acls
    }
}
