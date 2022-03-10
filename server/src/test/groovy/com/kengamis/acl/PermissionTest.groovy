package com.kengamis.acl

import com.kengamis.query.security.Permission
import spock.lang.Specification

class PermissionTest extends Specification{

    def setup() {
    }

    def cleanup() {
    }

    void "test adding different permissions returns a collect mask"() {
        when:
            def permissions = []
            (1..2).each {
                permissions << new Permission(it)
            }
        then:
            Permission.createPermissionsMask(permissions) == 3
    }

    void "check read write create combinations results in a right bit mast"() {
        given:
            Permission readPermission = new Permission(1)
            Permission writePermission = new Permission(2)
            Permission createPermission = new Permission(4)
        when:
            def array = []
            array << readPermission
            array << writePermission
            array << createPermission
            int resultMask = Permission.createPermissionsMask(array)
        then:
            resultMask == 7
    }

    void "check a given mask contains a given permission"() {
        given:
            Permission permissionToCheck = new Permission(8) //delete permission
            int mask = 13 //generated from Read-1, Create-4, Delete-8
        when:
            boolean hasPermission = Permission.hasPermission(mask,permissionToCheck)
        then:
            hasPermission == true
    }

    void "check a given mask doesnt contains a given permission"() {
        given:
        Permission permissionToCheck = new Permission(2) //write permission
        int mask = 13 //generated from Read-1, Create-4, Delete-8
        when:
        boolean hasPermission = Permission.hasPermission(mask,permissionToCheck)
        then:
        hasPermission == false
    }
}
