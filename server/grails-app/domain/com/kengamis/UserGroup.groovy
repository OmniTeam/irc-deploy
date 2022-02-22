package com.kengamis

import groovy.transform.ToString

@ToString(cache=true, includeNames=true, includePackage=false)
class UserGroup {

    String groupRole = KengaGroup.ROLE_BASIC

    String id
    User user
    KengaGroup group

    Date dateCreated
    Date lastUpdated

    static mapping = {
        id generator: 'uuid2'
    }
    static constraints = {
        user unique: 'group'
    }

    static UserGroup get(String userId, String groupId) {
        where {
            user == User.load(userId) && group == KengaGroup.load(groupId)
        }.get()
    }

    static UserGroup create(User user, KengaGroup group, String groupRole, boolean flush = false) {
        new UserGroup(user: user, group: group, groupRole: groupRole).save(flush: flush, insert: true)
    }

    static boolean remove(User user, KengaGroup group, boolean flush = false) {
        int rowCount = (int) where {
            user == User.load(user.id) && group == KengaGroup.load(group.id)
        }.deleteAll()
        rowCount > 0
    }

    static void removeAll(User u) {
        where {
            user == User.load(u.id)
        }.deleteAll()
    }

    static void removeAll(KengaGroup g) {
        where {
            group == KengaGroup.load(g.id)
        }.deleteAll()
    }
}
