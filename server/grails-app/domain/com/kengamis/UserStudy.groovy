package com.kengamis

import groovy.transform.ToString

@ToString(cache=true, includeNames=true, includePackage=false)
class UserStudy {

    String id
    User user
    Study study

    Date dateCreated
    Date lastUpdated

    static mapping = {
        id generator: 'uuid2'
    }
    static constraints = {
        user unique: 'study'
    }

    static UserStudy get(long userId, long studyId) {
        where {
            user == User.load(userId) &&
                    study == Study.load(studyId)
        }.get()
    }

    static UserStudy create(User user, Study study1, boolean flush = false) {
        new UserStudy(user: user, study: study1).save(flush: flush, insert: true)
    }

    static boolean remove(User u, Study s, boolean flush = false) {
        int rowCount = (int) where {
            user == User.load(u.id) &&
                    study == Study.load(s.id)
        }.deleteAll()

        rowCount > 0
    }

    static void removeAll(User u) {
        where {
            user == User.load(u.id)
        }.deleteAll()
    }
}
