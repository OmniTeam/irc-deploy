package com.kengamis

import grails.gorm.DetachedCriteria

class UserEntityViewFilters {

    String id
    User user
    EntityViewFilters entityViewFilters

    Date dateCreated
    Date lastUpdated
    static belongsTo = [user: User, entityViewFilters: EntityViewFilters]
    static mapping = {
        id generator: 'uuid2'
    }

    static constraints = {
        user unique: 'entityViewFilters'
    }

    static UserEntityViewFilters get(String userId, String entityViewFiltersId) {
        where {
            user == User.load(userId) && entityViewFilters == EntityViewFilters.load(entityViewFiltersId)
        }.get()
    }

    static UserEntityViewFilters create(User user, EntityViewFilters entityViewFilters, boolean flush = false) {
        new UserEntityViewFilters(user: user, entityViewFilters: entityViewFilters).save(flush: flush, insert: true)
    }

    static boolean remove(User user, EntityViewFilters entityViewFilters, boolean flush = false) {
        int rowCount = (int) where {
            user == User.load(user.id) && entityViewFilters == EntityViewFilters.load(entityViewFilters.id)
        }.deleteAll()
        rowCount > 0
    }

    static void removeAll(User u) {
        where {
            user == User.load(u.id)
        }.deleteAll()
    }

    static void removeAll(EntityViewFilters e) {
        DetachedCriteria<EntityViewFilters> filters = where {
            entityViewFilters == EntityViewFilters.load(e.id)
        } as DetachedCriteria<EntityViewFilters>
        filters.deleteAll()
    }
}
