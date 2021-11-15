package com.kengamis


import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@EqualsAndHashCode(includes = 'username')
@ToString(includes = 'username', includeNames = true, includePackage = false)
class User {

    transient springSecurityService

    String id
    String username
    String password
    boolean enabled = true
    boolean accountExpired = false
    boolean accountLocked = false
    boolean passwordExpired = false
    Date dateCreated
    Date lastUpdated

    static transients = ['springSecurityService']

    static hasMany = [userRoles: UserRole]
    static constraints = {
        password nullable: false, blank: false, password: true
        username nullable: false, blank: false, unique: true


    }

    static mapping = {
        password column: '`password`'
    }

    Set<Role> getAuthorities() {
        (UserRole.findAllByUser(this) as List<UserRole>)*.role as Set<Role>
    }

    def roles() {
        return this.userRoles.collect { it.role }
    }

    boolean hasRole(Role r) {
        if (r == null || id == null)
            return false
        return authorities.any { r.authority == it.authority }
    }

    boolean hasAnyRole(String... roleNames) {
        roleNames.any { role -> authorities?.any { role == it.authority } }
    }

    boolean hasStudy(Study study) {
        if (study == null || id == null)
            return false
        return studies.any { study.id == it.id }
    }

    boolean hasForm(Form form) {
        if (form == null || id == null)
            return false
        return forms.any { form.id == it.id }
    }

    Set<Form> getForms() {
        UserForm.findAllByUser(this).collect { it.form } as Set
    }

    Set<Study> getStudies() {
        UserStudy.findAllByUser(this).collect { it.study } as Set
    }

    Set<Group> getGroups() {
        UserGroup.findAllByUser(this).collect { it.group } as Set
    }

    Set<Group> getGroups(String role) {
        UserGroup.findAllByUserAndGroupRole(this, role).collect { it.group } as Set
    }

    List<User> findFellowUsers() {
        def groupIds = getGroups(Group.ROLE_SUPERVISOR).collect { it.id }
        if (!groupIds) return [this]
        return executeQuery("select distinct upg.user from UserGroup upg where upg.group.id in (:ids) ", [ids: groupIds])
    }

}
