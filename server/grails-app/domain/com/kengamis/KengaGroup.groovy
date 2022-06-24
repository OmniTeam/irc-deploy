package com.kengamis

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@EqualsAndHashCode(includes='name')
@ToString(includes='name', includeNames=true, includePackage=false)
class KengaGroup {

    String id
    String name
    Date dateCreated
    Date lastUpdated

    static hasMany = [kengaUserGroup: KengaUserGroup]
    static belongsTo = [parentGroup: KengaGroup]
    static mapping = {
        id generator: 'uuid2'
    }
    static constraints = {
        name blank: false,unique: true
        parentGroup nullable: true, unique: false
    }

    static KengaGroup create(program, name) {
        def instance = new KengaGroup(parentGroup: program, name: name)
        instance.save(flush: true)
        return  instance
    }


    Set<User> getUsers() {
        (KengaUserGroup.findAllByKengaGroup(this) as List<KengaUserGroup>)*.user as Set<User>
    }

}
