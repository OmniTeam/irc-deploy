package com.kengamis

import grails.compiler.GrailsCompileStatic
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@GrailsCompileStatic
@EqualsAndHashCode(includes = "name")
@ToString(includes = 'name', includeNames = true, includePackage = false)
class TaskDef {

    String id
    String name
    String description
    boolean startOnStartup = true
    String cronExpression
    String taskClass = 'com.kengamis.tasks.DynamicJobRunner'
    String extraParams
    Date dateCreated
    Date lastUpdated

    static constraints = {
        name nullable: false,unique: true
        description nullable: true
        cronExpression nullable: false
        taskClass nullable: false
        extraParams nullable: true
    }
}
