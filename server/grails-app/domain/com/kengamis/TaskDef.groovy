package com.kengamis

import com.kengamis.tasks.DynamicJobRunner
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import org.quartz.Job

@EqualsAndHashCode(includes = "name")
@ToString(includes = 'name', includeNames = true, includePackage = false)
class TaskDef {

    String id
    String name
    String description
    boolean startOnStartup = true
    String cronExpression
    String taskClass = DynamicJobRunner.class.name
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


    Class<Job> getClassInstance() {
        def job = Class.forName(getTaskClass())
        AppHolder.autowire(job)
        return job as Class<Job>;
    }
}
