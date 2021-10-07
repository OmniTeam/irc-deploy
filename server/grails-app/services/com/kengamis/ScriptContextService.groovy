package com.kengamis


class ScriptContextService implements ScriptExecutionContext {

    def springSecurityService
    def dataSource

    @Override
    String getCurrentUser() {
        return springSecurityService.currentUser.username as String
    }

    @Override
    List<String> getRoles() {
        def user = (springSecurityService.currentUser as User)
        return user.authorities.collect {it.authority}
    }
}
