package com.kengamis

import grails.events.annotation.gorm.Listener
import grails.plugin.springsecurity.SpringSecurityService
import groovy.transform.CompileStatic
import org.grails.datastore.mapping.engine.event.AbstractPersistenceEvent
import org.grails.datastore.mapping.engine.event.PreInsertEvent
import org.grails.datastore.mapping.engine.event.PreUpdateEvent
import org.springframework.beans.factory.annotation.Autowired

@CompileStatic
class UserPasswordEncoderListener {

    @Autowired
    SpringSecurityService springSecurityService

    @Listener([User])
    void onPreInsertEvent(PreInsertEvent event) {
        encodePasswordForEvent(event)
    }

    @Listener([User])
    void onPreUpdateEvent(PreUpdateEvent event) {
        encodePasswordForEvent(event)
    }

    private void encodePasswordForEvent(AbstractPersistenceEvent event) {
        //TODO uncomment the below code on data migration comment to allow password migration
        if (event.entityObject instanceof User) {
            Object u = event.entityObject as User
            if (u.password && ((event instanceof  PreInsertEvent) || (event instanceof PreUpdateEvent && u.isDirty('password')))) {
                event.getEntityAccess().setProperty('password', encodePassword(u.password))
            }
        }
    }

    private String encodePassword(String password) {
        springSecurityService?.passwordEncoder ? springSecurityService.encodePassword(password) : password
    }
}
