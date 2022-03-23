package com.kengamis

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
        def users = findAllByUser(u)
        users.each { it.delete(flush: true, failOnError: true) }
    }

    static void removeAll(EntityViewFilters e) {
        def filters = findAllByEntityViewFilters(e)
        filters.each { it.delete(flush: true, failOnError: true) }
    }

}
