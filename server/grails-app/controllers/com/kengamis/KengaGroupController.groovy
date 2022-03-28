package com.kengamis

import grails.validation.ValidationException

import static org.springframework.http.HttpStatus.CREATED
import static org.springframework.http.HttpStatus.NOT_FOUND
import static org.springframework.http.HttpStatus.NO_CONTENT
import static org.springframework.http.HttpStatus.OK
import static org.springframework.http.HttpStatus.UNPROCESSABLE_ENTITY

import grails.gorm.transactions.ReadOnly
import grails.gorm.transactions.Transactional

@ReadOnly
class KengaGroupController {

    KengaGroupService kengaGroupService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index() {
        /*params.max = Math.min(max ?: 1000, 1000)
        respond kengaGroupService.list(params), model:[kengaGroupCount: kengaGroupService.count()]*/

        def kenga_Groups = kengaGroupService.list(params)
        def list=[]
        kenga_Groups.each{KengaGroup grp ->
            def dataCollectors = []
            dataCollectors = AppHolder.withMisSqlNonTx {
                rows("SELECT user_id FROM kenga_user_group WHERE kenga_user_group.kenga_group_id = '$grp.id'")
            }
            list << [
                    id: grp.id,
                    name: grp.name,
                    data_collectors: dataCollectors
            ]
        }
        respond list
    }

    def show(String id) {
        def list=[]
        def data= kengaGroupService.get(id)
        def dataCollectors = [:]
        dataCollectors = AppHolder.withMisSqlNonTx {
            rows("SELECT user_id FROM kenga_user_group WHERE kenga_user_group.kenga_group_id = '$id'")
        }
        def dataCollectorsAsArray = dataCollectors.collect{it -> it.user_id}
        list << [
                id: data.id,
                name: data.name,
                data_collectors: dataCollectorsAsArray
        ]
        respond list
//        respond kengaGroupService.get(id)
    }

    @Transactional
    def save(KengaGroup kengaGroup) {
        if (kengaGroup == null) {
            render status: NOT_FOUND
            return
        }
        if (kengaGroup.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond kengaGroup.errors
            return
        }

        try {
            kengaGroupService.save(kengaGroup)
        } catch (ValidationException e) {
            respond kengaGroup.errors
            return
        }

        respond kengaGroup, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(KengaGroup kengaGroup) {
        if (kengaGroup == null) {
            render status: NOT_FOUND
            return
        }
        if (kengaGroup.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond kengaGroup.errors
            return
        }

        try {
            updateKengaUserGroups()
            kengaGroupService.save(kengaGroup)
        } catch (ValidationException e) {
            respond kengaGroup.errors
            return
        }

        respond kengaGroup, [status: OK, view:"show"]
    }

    @Transactional
    def delete(String id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        kengaGroupService.delete(id)

        render status: NO_CONTENT
    }

    @Transactional
    def updateKengaUserGroups(){
        def id = params.id as String
        def kengaGroup = KengaGroup.get(id)
        KengaUserGroup.deleteOldRecords(kengaGroup)

        def dataCollectors = params.data_collectors as String
        def listOfDataCollectors = dataCollectors ? dataCollectors.split(",") : []
        listOfDataCollectors?.each{ myDataCollector ->
            def currentCollector = User.get(myDataCollector)
            KengaUserGroup.create(kengaGroup, currentCollector, true)
        }
    }
}
