package com.kengamis

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@EqualsAndHashCode(includes = "name")
@ToString(includes = 'displayName', includeNames = true, includePackage = false)
class Form {

    final static String TABLE_POSTFIX = 'xxx'

    String id
    String name
    String displayName
    String description
    Date dateCreated
    Date lastUpdated
    boolean enabled = true
    boolean syncMode = true
    String centralId

    static hasMany = [formSettings: FormSetting]
    static belongsTo = [study: Study]

    static constraints = {
        name nullable: false
        description nullable: true
        centralId nullable: false
        displayName nullable: false
    }

    boolean hasViewableColumns() {
        if (id == null)
            return false

        def settings = FormSetting.findByViewInTableAndForm(true, this)

        if (settings) {
            return true
        } else {
            return false
        }
    }

    FormSetting findFormSetting(String questionId) {
        formSettings.find { it.field == questionId }
    }

    static List<Form> listAllUserForms(User user) {
        if (user.hasAnyRole('ROLE_ADMIN', 'ROLE_SUPER_ADMIN')) {
            return findAll()
        }
        def forms = UserForm.findAllByUser(user).form
        return forms
    }

    String getRepeatTablePrefix() {
        if ((study.syncMode == Study.SYNC_MODE_NEW) || (study.syncMode == Study.SYNC_MODE_LEGACY)) {
            return "_${centralId}_"
        }
        return "${name}_"
    }


    String resolveGroupTableName(String repeatQnField) {
        return "$repeatTablePrefix$repeatQnField"
    }

    Form addFormSettingIfAbsent(FormSetting setting) {
        if (!formSettings.any { it.field == setting.field }) {
            addToFormSettings(setting)
        }
        return this
    }
}
