package com.kengamis

import groovy.transform.ToString

@ToString(cache=true, includeNames=true, includePackage=false)
class UserGroup {

    String groupRole = Group.ROLE_BASIC

    String id
    User user
    Group group

    Date dateCreated
    Date lastUpdated

    static constraints = {
        user unique: 'group'
    }

    static UserGroup get(String userId, String groupId) {
        where {
            user == User.load(userId) && group == Group.load(groupId)
        }.get()
    }

    static UserGroup create(User user, Group group, String groupRole, boolean flush = false) {
        new UserGroup(user: user, group: group, groupRole: groupRole).save(flush: flush, insert: true)
    }

    static boolean remove(User user, Group group, boolean flush = false) {
        int rowCount = (int) where {
            user == User.load(user.id) && group == Group.load(group.id)
        }.deleteAll()
        rowCount > 0
    }

    static void removeAll(User u) {
        where {
            user == User.load(u.id)
        }.deleteAll()
    }

    static void removeAll(Group g) {
        where {
            group == Group.load(g.id)
        }.deleteAll()
    }
}
