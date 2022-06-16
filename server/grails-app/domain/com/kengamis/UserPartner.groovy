package com.kengamis

class UserPartner {

    String id
    User user
    ProgramPartner programPartner

    Date dateCreated
    Date lastUpdated

    static belongsTo = [user: User, programPartner: ProgramPartner]

    static mapping = {
        id generator: 'uuid2'
    }

    static constraints = {
        user unique: 'programPartner'
    }

    static UserPartner create(ProgramPartner programPartner, User user, boolean flush = false) {
        def instance = new UserPartner(user: user, programPartner: programPartner)
        instance.save(flush: flush)
        instance
    }

    static void deleteOldRecords(User e){
        def filters = findAllByUser(e)
        filters.each { it.delete(flush: true, failOnError: true) }
    }

    static getUserPartners(e){
        def partners = findAllByUser(e)
        return partners.collect { it.programPartnerId}
    }

}
