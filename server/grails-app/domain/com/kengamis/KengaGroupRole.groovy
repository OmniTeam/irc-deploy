package com.kengamis

import grails.gorm.DetachedCriteria
import groovy.transform.ToString
import org.codehaus.groovy.util.HashCodeHelper

@ToString(cache=true, includeNames=true, includePackage=false)
class KengaGroupRole implements Serializable{
    String id
    KengaGroup kengaGroup
    Role role
    Date dateCreated
    Date lastUpdated

    @Override
    boolean equals(other) {
        if (other instanceof KengaGroupRole) {
            other.kengaGroupId == kengaGroup?.id && other.roleId == role?.id
        }
    }

    @Override
    int hashCode() {
        int hashCode = HashCodeHelper.initHash()
        if (kengaGroup) {
            hashCode = HashCodeHelper.updateHash(hashCode, kengaGroup.id)
        }
        if (role) {
            hashCode = HashCodeHelper.updateHash(hashCode, role.id)
        }
        hashCode
    }

    static KengaGroupRole get(String kengaGroupId, String roleId) {
        criteriaFor(kengaGroupId, roleId).get()
    }

    static boolean exists(String kengaGroupId, String roleId) {
        criteriaFor(kengaGroupId, roleId).count()
    }

    private static DetachedCriteria criteriaFor(String kengaGroupId, String roleId) {
        where {
            kengaGroup == KengaGroup.load(kengaGroupId) &&
                    role == Role.load(roleId)
        }
    }

    static KengaGroupRole create(KengaGroup kengaGroup, Role role, boolean flush = false) {
        def instance = new KengaGroupRole(kengaGroup: kengaGroup, role: role)
        instance.save(flush: flush)
        instance
    }

    static boolean remove(KengaGroup kengaGroup, Role r) {
        if (kengaGroup != null && r != null) {
            where { kengaGroup == kengaGroup && role == r }.deleteAll()
        }
    }

    static int removeAll(KengaGroup kengaGroup) {
        kengaGroup == null ? 0 : where { kengaGroup == kengaGroup }.deleteAll() as int
    }

    static int removeAll(Role r) {
        r == null ? 0 : where { role == r }.deleteAll() as int
    }

    static constraints = {
        kengaGroup nullable: false
        role nullable: false, validator: { Role r, KengaGroupRole kr->
            if(kr.kengaGroup?.id) {
                if(exists(kr.kengaGroup.id, r.id)) {
                    return ['userRole.exists']
                }
            }
        }
    }

    static mapping = {
        id generator: 'uuid2'
        id composite: ['kengaGroup', 'role']
    }

    static belongsTo = [kengaGroup: KengaGroup, role: Role]




}
