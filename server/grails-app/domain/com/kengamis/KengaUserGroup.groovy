package com.kengamis

import grails.gorm.DetachedCriteria
import groovy.transform.ToString
import org.codehaus.groovy.util.HashCodeHelper

@ToString(cache=true, includeNames=true, includePackage=false)
class KengaUserGroup implements Serializable{
    String id
    KengaGroup kengaGroup
    User user
    Date dateCreated
    Date lastUpdated

    @Override
    boolean equals(other) {
        if (other instanceof KengaUserGroup) {
            other.kengaGroupId == kengaGroup?.id && other.userId == user?.id
        }
    }

    @Override
    int hashCode() {
        int hashCode = HashCodeHelper.initHash()
        if (kengaGroup) {
            hashCode = HashCodeHelper.updateHash(hashCode, kengaGroup.id)
        }
        if (user) {
            hashCode = HashCodeHelper.updateHash(hashCode, user.id)
        }
        hashCode
    }

    static KengaUserGroup get(String kengaGroupId, String userId) {
        criteriaFor(kengaGroupId, userId).get()
    }

    static List<KengaGroup> findAllGroups(String username) {
        where { user == User.findByUsername(username) }?.collect {it.kengaGroup}
    }

    static boolean exists(String kengaGroupId, String userId) {
        criteriaFor(kengaGroupId, userId).count()
    }

    private static DetachedCriteria criteriaFor(String kengaGroupId, String userId) {
        where {
            kengaGroup == KengaGroup.load(kengaGroupId) &&
                    user == User.load(userId)
        }
    }

    static KengaUserGroup create(KengaGroup kengaGroup, User user, boolean flush = false) {
        def instance = new KengaUserGroup(kengaGroup: kengaGroup, user: user)
        instance.save(flush: flush)
        instance
    }

    static boolean remove(KengaGroup kengaGroup, User u) {
        if (kengaGroup != null && u != null) {
            where { kengaGroup == kengaGroup && user == u }.deleteAll()
        }
    }

    static int removeAll(KengaGroup kengaGroup) {
        kengaGroup == null ? 0 : where { kengaGroup == kengaGroup }.deleteAll() as int
    }

    static int removeAll(User u) {
        u == null ? 0 : where { user == u }.deleteAll() as int
    }

    static constraints = {
        kengaGroup nullable: false
        user nullable: false, validator: { User u, KengaUserGroup kr->
            if(kr.kengaGroup?.id) {
                if(exists(kr.kengaGroup.id, u.id)) {
                    return ['userRole.exists']
                }
            }
        }
    }

    static mapping = {
        id generator: 'uuid2'
        id composite: ['kengaGroup', 'user']
    }

    static belongsTo = [kengaGroup: KengaGroup, user: User]

}
