package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class TaskDefServiceSpec extends Specification {

    TaskDefService taskDefService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new TaskDef(...).save(flush: true, failOnError: true)
        //new TaskDef(...).save(flush: true, failOnError: true)
        //TaskDef taskDef = new TaskDef(...).save(flush: true, failOnError: true)
        //new TaskDef(...).save(flush: true, failOnError: true)
        //new TaskDef(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //taskDef.id
    }

    void "test get"() {
        setupData()

        expect:
        taskDefService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<TaskDef> taskDefList = taskDefService.list(max: 2, offset: 2)

        then:
        taskDefList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        taskDefService.count() == 5
    }

    void "test delete"() {
        Long taskDefId = setupData()

        expect:
        taskDefService.count() == 5

        when:
        taskDefService.delete(taskDefId)
        sessionFactory.currentSession.flush()

        then:
        taskDefService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        TaskDef taskDef = new TaskDef()
        taskDefService.save(taskDef)

        then:
        taskDef.id != null
    }
}
