package com.kengamis

import grails.converters.JSON
import grails.validation.ValidationException
import org.apache.http.HttpStatus
import org.springframework.web.multipart.MultipartFile

import static org.springframework.http.HttpStatus.CREATED
import static org.springframework.http.HttpStatus.NOT_FOUND
import static org.springframework.http.HttpStatus.NO_CONTENT
import static org.springframework.http.HttpStatus.OK
import static org.springframework.http.HttpStatus.UNPROCESSABLE_ENTITY

import grails.gorm.transactions.ReadOnly
import grails.gorm.transactions.Transactional

@ReadOnly
class UserController {

    UserService userService
    UserRoleService userRoleService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 1000, 1000)
        respond userService.list(params), model:[userCount: userService.count()]
    }

    def show(String id) {
        def user = User.get(id)
        def kengaGroups = user.kengaGroups
        def roles = user.authorities
        def users= [
                id: user.id,
                username: user.username,
                email: user.email,
                names: user.names,
                groups: kengaGroups,
                role: roles,
                enabled: user.enabled
        ]
        respond users
    }

    def getDataCollectors() {
        def role = Role.findByAuthority('ROLE_DATA_COLLECTOR')
        def userRoles = UserRole.findAllByRole(role)
        def dataCollectors = userRoles.collect { userRole ->
            def user = userRole.user
            [names: user.names, id: user.id] }
        respond dataCollectors
    }

    @Transactional
    def save(User user) {
        if (user == null) {
            render status: NOT_FOUND
            return
        }
        if (user.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond user.errors
            return
        }

        try {
            userService.save(user)
        } catch (ValidationException e) {
            respond user.errors
            return
        }

        respond user, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(User user) {
        def userId =user.id
        def userRole = params.role as String
        def userGroup = params.groups

        print("user groups")
        print(userGroup)
        if (user == null) {
            render status: NOT_FOUND
            return
        }
        if (user.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond user.errors
            return
        }

        try {
            deleteOldRolesAndGroups(userId)
            userService.save(user)
        } catch (ValidationException e) {
            respond user.errors
            return
        }

        respond user, [status: OK, view:"show"]
    }

    @Transactional
    def delete(String id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        userService.delete(id)

        render status: NO_CONTENT
    }

    @Transactional
    def uploadUsers() {
        println("===================")
        try{
            MultipartFile file = request.getFile('users')
            String fileType = file.getContentType()
            println fileType
            userService.importUsers(file)
            render([code: HttpStatus.SC_OK, msg: "Successfully uploaded users."] as JSON)
        }catch(Exception ex) {
            ex.printStackTrace()
        }
    }

    @Transactional
    def deleteOldRolesAndGroups(userId){
        def kengaUserGroup= User.get(userId)
//        section for User Role.
//        Remove the old user role before adding a new one
        UserRole.deleteOldRecords(kengaUserGroup)

//        section for Kenga User Group
//        Remove the old Kenga user Groups before adding a new one
        KengaUserGroup.deleteOldRecordsUser(kengaUserGroup)

    }



}
