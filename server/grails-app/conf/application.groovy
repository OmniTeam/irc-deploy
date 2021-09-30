grails.plugin.springsecurity.rest.token.storage.jwt.secret = 'qrD6h8K6S9503Q06Y6Rfk21TErImPYqa'
grails.plugin.springsecurity.filterChain.chainMap = [
        //Stateless chain
        [
                pattern: '/**',
                filters: 'JOINED_FILTERS,-anonymousAuthenticationFilter,-exceptionTranslationFilter,-authenticationProcessingFilter,-securityContextPersistenceFilter,-rememberMeAuthenticationFilter'
        ],

        //Traditional, stateful chain
        [
                pattern: '/stateful/**',
                filters: 'JOINED_FILTERS,-restTokenValidationFilter,-restExceptionTranslationFilter'
        ]
]

// Added by the Spring Security Core plugin:
grails.plugin.springsecurity.userLookup.userDomainClassName = 'com.kengamis.User'
grails.plugin.springsecurity.userLookup.authorityJoinClassName = 'com.kengamis.UserRole'
grails.plugin.springsecurity.authority.className = 'com.kengamis.Role'
grails.plugin.springsecurity.requestMap.className = 'com.kengamis.RequestMap'
grails.plugin.springsecurity.securityConfigType = 'Requestmap'

<<<<<<< HEAD
=======

>>>>>>> origin/master
grails.plugin.springsecurity.controllerAnnotations.staticRules = [
        [pattern: '/', access: ['permitAll']],
        [pattern: '/error', access: ['permitAll']],
        [pattern: '/index', access: ['permitAll']],
        [pattern: '/index.gsp', access: ['permitAll']],
        [pattern: '/shutdown', access: ['permitAll']],
        [pattern: '/assets/**', access: ['permitAll']],
        [pattern: '/**/js/**', access: ['permitAll']],
        [pattern: '/**/css/**', access: ['permitAll']],
        [pattern: '/**/images/**', access: ['permitAll']],
        [pattern: '/**/favicon.ico', access: ['permitAll']],
        [pattern: '/api/v1/dashboard/account-summary/**', access: ['permitAll']],
]

grails.plugin.springsecurity.filterChain.chainMap = [
        [pattern: '/assets/**', filters: 'none'],
        [pattern: '/**/js/**', filters: 'none'],
        [pattern: '/**/css/**', filters: 'none'],
        [pattern: '/**/images/**', filters: 'none'],
        [pattern: '/**/favicon.ico', filters: 'none'],
        [pattern: '/**', filters: 'JOINED_FILTERS']
]


grails.plugin.databasemigration.changelogFileName = 'changelog.groovy'
grails.plugin.databasemigration.dropOnStart = false
grails.plugin.databasemigration.updateOnStart = true
//grails.plugin.databasemigration.updateOnStartFileName = 'changelog.groovy'

<<<<<<< HEAD
=======

>>>>>>> origin/master
grails.gorm.default.mapping = {
    id generator: 'uuid2'
    version false
    autoTimestamp true
}

grails.gorm.default.constraints = {
    //Make all data imported with its floating points at least round off to 5 decimal places
    '*'(scale: 5)
}
<<<<<<< HEAD

/*

grails {
    plugin {
        springsecurity {
            rest {
                token {
                    validation {
                        useBearerToken = false
                        enableAnonymousAccess = true
                    }
                    storage {
                        jwt {
                            secret = 'qrD6h8K6S9503Q06Y6Rfk21TErImPYqa'
                        }
                    }
                }
                oauth {
                    frontendCallbackUrl = { String tokenValue -> "http://localhost:8080/auth/success?token=${tokenValue}" }
                    google {
                        client = org.pac4j.oauth.client.Google2Client
                        key = '${GOOGLE_KEY}'
                        secret = '${GOOGLE_SECRET}'
                        scope = org.pac4j.oauth.client.Google2Client.Google2Scope.EMAIL_AND_PROFILE
                        defaultRoles = []
                    }
                }
            }
            providerNames = ['anonymousAuthenticationProvider']
        }
    }
}

*/

grails.plugin.springsecurity.providerNames = [
        'xenoAuthenticationProvider',
        'anonymousAuthenticationProvider',
        'rememberMeAuthenticationProvider'
]

=======
>>>>>>> origin/master
environments {
    development {
        uploadFolder = "D:/uploads/"
        uploadDocsFolder = "D:/uploads/"
<<<<<<< HEAD
//        uploadFolder = "/Users/niwogabajoel/appdata/uploads/"
//        uploadDocsFolder = "/Users/niwogabajoel/appdata/uploads/"
    }
    production {
        uploadFolder = "/appdata/"
        uploadDocsFolder = "/documents/"
        //fontsFolder = "/appdata/ultima/fonts"
=======
    }
    production {
        uploadFolder = "/appdata/ultima/uploads/ug/"
        uploadDocsFolder = "/appdata/ultima/uploads/ug/documents/"
>>>>>>> origin/master


    }
}
