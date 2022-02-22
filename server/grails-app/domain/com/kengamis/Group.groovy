package com.kengamis

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@EqualsAndHashCode(includes='name')
@ToString(includes='name', includeNames=true, includePackage=false)
class Group {

    static String ROLE_BASIC = 'basic'
    static String ROLE_SUPERVISOR = 'supervisor'

    String id
    String name
    Date dateCreated
    Date lastUpdated

    static mapping = {
        id generator: 'uuid2'
    }
    static constraints = {
        name blank: false,unique: true
    }

    Set<User> getUsers(){
        UserGroup.findAllByGroup(this).collect{ it.user } as Set
    }
}
