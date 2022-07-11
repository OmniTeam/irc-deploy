package com.kengamis

import grails.converters.JSON
import grails.plugin.springsecurity.SpringSecurityService
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
    SpringSecurityService springSecurityService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 1000, 1000)
        def users = []
        User.all.each { user ->
            def roles = user.authorities.collect {it.authority}.join(",")
            def groups = user.kengaGroups.collect {it.name}.join(",")

                users << [id    : user.id, username: user.username, email: user.email, names: user.names,
                          groups: groups, roles: roles, enabled: user.enabled]

        }
        respond users
    }

    def show(String id) {
        def user = User.get(id)
        def kengaGroups = user.kengaGroups.collect{it.id}
        def roles = user.authorities.collect {it.id}
        def partner = user.getPartner()
        def users= [
                id: user.id,
                username: user.username,
                password: user.password,
                email: user.email,
                names: user.names,
                groups: kengaGroups,
                role: roles,
                partner: partner?.id,
                enabled: user.enabled
        ]
        respond users
    }

    def getCurrentUserPartners(){
        def currentUser = springSecurityService.currentUser
        def currentUserPartners = UserPartner.getUserPartners(currentUser)
        respond currentUserPartners
    }

    def getMISUsers(){
        def users = []
        User.all.each { user ->
            def roles = user.authorities.collect {it.authority}.join(",")
            def groups = user.kengaGroups.collect {it.name}.join(",")
            if (!roles.contains("ROLE_DATA_COLLECTOR") ){
                users << [id    : user.id, username: user.username, email: user.email, names: user.names,
                          groups: groups, roles: roles, enabled: user.enabled]
            }
        }
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
            updateRolesAndGroups(userId)
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
    def updateRolesAndGroups(userId){
        def currentUser = User.get(userId)

        UserRole.deleteOldRecords(currentUser)
        KengaUserGroup.deleteOldRecordsUser(currentUser)
        UserPartner.deleteOldRecords(currentUser)

        def usersRole = params.role as String
        def listOfUserRoles = usersRole ? usersRole.split(",") : []
        listOfUserRoles?.each {myUserRole ->
            def currentRole = Role.get(myUserRole)
            UserRole.create(currentUser, currentRole, true)
        }

        def userGroup = params.groups as String
        def listOfUserGroups = userGroup ? userGroup.split(",") : []
        listOfUserGroups?.each{ myUserGroup ->
            def currentGroup = KengaGroup.get(myUserGroup)
            KengaUserGroup.create(currentGroup,currentUser, true)
        }

        def userPartner = params.partner as String
        def listOfUserPartners = userPartner ? userPartner.split(",") : []
        listOfUserPartners?.each{ myUserPartner ->
            def currentPartner = ProgramPartner.get(myUserPartner)
            UserPartner.create(currentPartner,currentUser, true)
        }
    }

    def getUserGroupUsingPartner(){
        def partnerId = params.partnerId
        def partnerObject = ProgramPartner.findById(partnerId)
        def partnerName = partnerObject.cluster
        def kengaGroup = KengaGroup.findByName(partnerName)
        respond kengaGroup
    }
}
