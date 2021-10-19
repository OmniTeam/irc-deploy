package com.kengamis

import grails.compiler.GrailsCompileStatic
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@GrailsCompileStatic
@EqualsAndHashCode(includes = "name")
@ToString(includes = 'name', includeNames = true, includePackage = false)
class Study implements Serializable {

    private static final long serialVersionUID = 1

    public static final SYNC_MODE_LEGACY = 'legacy'
    public static final SYNC_MODE_NEW = 'central'

    String id
    String name
    String centralId
    String syncMode = SYNC_MODE_NEW
    Date dateCreated
    Date lastUpdated
    boolean syncToMetabase = false
    boolean archiveStudy = false

    static hasMany = [forms: Form]

    static constraints = {
        centralId nullable: false
    }
}
