package com.kengamis

import com.kengamis.acl.KengaGroupAclEntry
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
        def kenga_Groups = kengaGroupService.list(params)
        def list = []
        kenga_Groups.each { KengaGroup grp ->
            def users = grp.users.collect {it.username}.join(",")
            list << [
                    id             : grp.id,
                    name           : grp.name,
                    dateCreated    : grp.dateCreated,
                    users: users
            ]
        }
        respond list
    }

    def show(String id) {
        def kengaGroup = KengaGroup.get(id)
        def list = []
        def data = kengaGroupService.get(id)
//        getting parent of the current group
        def parent = kengaGroup.parentGroup.collect { it.id }.join(",")
//        getting users associated with the group
        def users = kengaGroup.users.collect { it.id }

        list << [
                id         : data.id,
                name       : data.name,
                parentGroup: parent,
                users      : users
        ]
        respond list
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

        respond kengaGroup, [status: CREATED, view: "show"]
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

        respond kengaGroup, [status: OK, view: "show"]
    }

    @Transactional
    def delete(String id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        deletedGroupsACLS(id)
        kengaGroupService.delete(id)

        render status: NO_CONTENT
    }

    @Transactional
    def updateKengaUserGroups() {
        def id = params.id as String
        def kengaGroup = KengaGroup.get(id)
        KengaUserGroup.deleteOldRecords(kengaGroup)

        def groupUsers = params.users as String
        def listOfGroupUsers = groupUsers ? groupUsers.split(",") : []
        listOfGroupUsers?.each { myUser ->
            def currentUser = User.get(myUser)
            KengaUserGroup.create(kengaGroup, currentUser, true)
        }
    }

    @Transactional
    def deletedGroupsACLS(id){
        def groupObject = KengaGroup.get(id)
        print(groupObject)
        KengaGroupAclEntry.deleteACLByGroup(groupObject)
    }
}
