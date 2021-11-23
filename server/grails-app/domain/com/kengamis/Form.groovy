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

    boolean hasFormSetting(Form form, String field) {
        if (id == null)
            return false

        def settings = FormSetting.findByFormAndField(form, field)

        if (settings) {
            return true
        } else {
            return false
        }
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
}
