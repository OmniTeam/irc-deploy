package com.kengamis


import grails.rest.*
import grails.converters.*

class UserApiController {

    UserService userService
    UserRoleService userRoleService

    static responseFormats = ['json', 'xml']

    def "getLoginUser"() {
        def user = User.findByUsername(params.username)
        def userResp = []
        if (user) {
            userResp = ['username': user.username, 'password': user.password,'names':user.names,'email':user.email]
        }
        respond userResp
    }

    def "users"() {
        def users = User.all.collect {
            ['id': it.id, 'username': it.username, 'password': it.password,'names':it.names,'email':it.email]
        }

        respond users
    }

    def "one-user"() {
        def user = User.findByUsername(params.username)
        def users = []
        if (user) {
            users << ['username': user.username, 'password': user.password,'names':user.names,'email':user.email]
        }
        respond users
    }

    def "groups"() {
        def groups = []
        if(params.groupId){
            def partnerGrp = Role.findById(params.groupId)
            if(partnerGrp){
                groups << ['id':partnerGrp.id,'name':partnerGrp.authority ]
            }
        }else{
            groups = Role.list().collect {
                ['id': it.id, 'name': it.authority]
            }
        }
        respond groups
    }

    def "group-users"() {
        def userGroups = UserRole.findAllByRole(Role.findById(params.groupId))
        def users = userGroups.collect { it.user }.collect {
            ['id': it.id, 'username': it.username, 'password': it.password,'names':it.names,'email':it.email]
        }
        respond users
    }

    def "user-groups"() {
        def userId = params.userId
        def userGroups = UserRole.findAllByUser(User.findByUsername(userId))
                .collect { it.getRole() }
                .collect {
                    ['id': it.id, 'name': it.authority]
                }
        respond userGroups
    }
}
