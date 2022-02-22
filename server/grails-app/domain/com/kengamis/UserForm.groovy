package com.kengamis

import grails.plugin.springsecurity.SpringSecurityUtils
import groovy.transform.ToString

@ToString(cache=true, includeNames=true, includePackage=false)
class UserForm {

    String id
    User user
    Form form

    Date dateCreated
    Date lastUpdated

    static belongsTo = [form: Form]

    static mapping = {
        id generator: 'uuid2'
    }
    static constraints = {
        user unique: 'form'
    }

    static UserForm get(long userId, long formId) {
        where {
            user == User.load(userId) &&
                    form == Form.load(formId)
        }.get()
    }

    static UserForm create(User user, Form form, boolean flush = false) {
        new UserForm(user: user, form: form).save(flush: flush, insert: true)
    }

    static boolean remove(User user, Form form, boolean flush = false) {
        int rowCount = (int) where {
            user == User.load(user.id) &&
                    form == Form.load(form.id)
        }.deleteAll()
        rowCount > 0
    }

    static void removeAll(User u) {
        where {
            user == User.load(u.id)
        }.deleteAll()
    }

    static List<UserForm> getUserStudyForms(Study study,User user1){
        if(isAdmin()){
            return findAllByFormInList(study.forms as List)
        }
        where {
            form.study == study && user == user1
        }.list()
    }

    static boolean isAdmin(){
        return SpringSecurityUtils.ifAnyGranted('ROLE_SUPER_ADMIN,ROLE_ADMIN')
    }
}
