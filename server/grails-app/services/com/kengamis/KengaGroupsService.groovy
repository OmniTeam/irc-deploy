package com.kengamis

import com.kengamis.query.security.IKengaGroupPermissionEvaluator
import com.kengamis.query.security.KengaGroupPermissionEvaluator
import com.kengamis.query.security.Permission
import grails.gorm.transactions.Transactional
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.Authentication

@Transactional
class KengaGroupsService {

    def springSecurityService

    KengaGroupPermissionEvaluator kengaGroupPermissionEvaluator

    List<Object> postFilter(List<Object> data, Permission permission, String tableName = "") {
        if(isSuperUser()) return data
        Authentication authentication = springSecurityService.authentication
        List<Object> accessible = data.findAll { kengaGroupPermissionEvaluator.hasPermission(authentication, it, permission, tableName) }
        return  accessible
    }

    boolean isSuperUser(){
        def user = springSecurityService.currentUser as User
        return user.hasAnyRole('ROLE_SUPER_ADMIN')
    }

}
