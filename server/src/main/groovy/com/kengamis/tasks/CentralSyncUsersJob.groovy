package com.kengamis.tasks

import com.kengamis.*
import grails.util.Holders
import groovy.util.logging.Log4j

import static com.kengamis.RestHelper.withCentral

@Log4j
class CentralSyncUsersJob extends Script {

    CentralService centralService
    UserService userService
    static String superPass = Holders.grailsApplication.config.server.superPass as String
    static String centralId = Holders.grailsApplication.config.server.centralId as String

    @Override
    Object run() {
        try {
            centralService = AppHolder.bean('centralService')
            def token = centralService.get()
            def study = Study.findByCentralId(centralId)
            syncCentralUsers(study, token)
        }
        catch (Exception e) {
            println("Exception: " + e.getMessage())
        }
    }

    def syncCentralUsers(Study study, token) {
        def studyId = study.centralId
        def appUsers = withCentral { listAppUsers(centralService.get(), studyId) }
        insertCentralAppUsers(appUsers)
    }

    static def insertCentralAppUsers(def users) {
        def role = Role.findByAuthority('ROLE_DATA_COLLECTOR') ?: new Role(authority: 'ROLE_DATA_COLLECTOR').save(flush: true, failOnError: true)
        users.each {
            def displayName = it['displayName'] as String
            def centralUserName = displayName.replaceAll(' ', '_')
            def user = User.findByUsername(centralUserName)
            if (user) {
                def oldUser = User.get(user.id)
                oldUser.username = centralUserName
                oldUser.save(flush: true, failOnError: true)
                if (!oldUser.authorities.contains(role)) {
                    UserRole.create user, role
                }
                log.info("Saving central ID for  user : $oldUser.username into mis")
            } else {
                def newUser = new User(
                        username: centralUserName,
                        password: superPass,
                        names: displayName,
                        enabled: false).save(flush: true, failOnError: true)
                if (!newUser.authorities.contains(role)) {
                    UserRole.create user, role
                }
                log.info("Saving central app user : $newUser.username into mis")
            }
        }
        log.info("Imported ${users.size()} User(s)")
    }
}
