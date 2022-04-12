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
        def formId = json.form
        def permission = json.permissions
        def grpConditionQuery = json.groupConditionQuery
        def kengaGroup = KengaGroup.get(groupId)
        def form = Form.get(formId)
        def kengaDataTable = KengaDataTable.findByTableName(form.name)

        //create entries
        def records = AppHolder.withMisSqlNonTx {
            def query = "select * from ${form.name} ${grpConditionQuery}"
            log.info(query)
            rows(query.toString())
        }
        log.info("==============size${records.size()}")
        records.each {record->
            def kengaAclTableRecordIdentity = KengaAclTableRecordIdentity.findByDataTableRecordId(record."$kengaDataTable.idLabel")
            new KengaGroupAclEntry(
                    kengaAclTableRecordIdentity: kengaAclTableRecordIdentity,
                    kengaGroup: kengaGroup,
                    mask: permission
            ).save(flush: true, failOnError: true)
        }

    }

    @Transactional
    def saveGroupMappingsWithParent(){
        def json=request.JSON
        def groupId = json.group
        def permission = json.permissions
        def queryArray = json.queryArray


//        loop through the array and assign the acls per iteration
        queryArray.each{ it ->
            def formId = it.form
            def grpConditionQuery = it.groupConditionQuery

            def kengaGroup = KengaGroup.get(groupId)
            def form = Form.get(formId)
            def kengaDataTable = KengaDataTable.findByTableName(form.name)

            //query records
            def records = AppHolder.withMisSqlNonTx {
                def query = "select * from ${form.name} ${grpConditionQuery}"
                log.info(query)
                rows(query.toString())
            }
            log.info("==============size${records.size()}")

            // create entries
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

    def allMisTables() {
        def tables = AppHolder.withMisSqlNonTx {
            def query = "show tables;"
            rows(query)
        }

        render tables as JSON
    }
}
