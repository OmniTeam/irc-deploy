package com.kengamis

import grails.compiler.GrailsCompileStatic
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@GrailsCompileStatic
@EqualsAndHashCode(includes = "name")
@ToString(includes = 'displayName', includeNames = true, includePackage = false)
class Form implements Serializable {

    private static final long serialVersionUID = 1

    final static String TABLE_POSTFIX = 'xxx'

    String id
    String name
    String displayName
    String description
    Date dateCreated
    Date lastUpdated
    boolean enabled = true
    boolean syncMode = true
    String oxdId

    static hasMany = [formSettings: FormSetting]
    static belongsTo = [study: Study]

    static constraints = {
        name nullable: false
        description nullable: true
        oxdId nullable: true
        displayName nullable: false
    }
}
