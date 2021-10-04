package com.kengamis

import grails.gorm.transactions.Transactional

class BootStrap {

    def init = { servletContext ->
        initData()
    }
    def destroy = {
    }

    @Transactional
    def initData() {
        def superAdminRole = Role.findByAuthority('ROLE_SUPER_ADMIN') ?: new Role(authority: 'ROLE_SUPER_ADMIN')
        superAdminRole.save(failOnError: true, flush: true)
        def adminRole = Role.findByAuthority('ROLE_ADMIN') ?: new Role(authority: 'ROLE_ADMIN')
        adminRole.save(failOnError: true, flush: true)

        def superAdminUser = User.findByUsername('super') ?: new User(
                username: 'super',
                password: 'pass',
                enabled: true).save(failOnError: true)

        def adminUser = User.findByUsername('root') ?: new User(
                username: 'root',
                password: 'pass',
                enabled: true).save(failOnError: true)

        if (!superAdminUser.authorities.contains(superAdminRole)) {
            UserRole.create superAdminUser, superAdminRole
        }

        if (!adminUser.authorities.contains(adminRole)) {
            UserRole.create adminUser, adminRole
        }


        for (String url in [
                '/login/auth', '/**/js/**', '/**/css/**',
                '/**/images/**', '/**/favicon.ico']) {
            new RequestMap(url: url, configAttribute: 'permitAll').save()
        }
        new RequestMap(url: '/**', configAttribute: 'ROLE_SUPER_ADMIN,ROLE_ADMIN').save()
    }
}
