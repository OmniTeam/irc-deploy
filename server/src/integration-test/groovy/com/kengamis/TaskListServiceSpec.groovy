package com.kengamis

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class TaskListServiceSpec extends Specification {

    TaskListService taskListService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new TaskList(...).save(flush: true, failOnError: true)
        //new TaskList(...).save(flush: true, failOnError: true)
        //TaskList taskList = new TaskList(...).save(flush: true, failOnError: true)
        //new TaskList(...).save(flush: true, failOnError: true)
        //new TaskList(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //taskList.id
    }

    void "test get"() {
        setupData()

        expect:
        taskListService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<TaskList> taskListList = taskListService.list(max: 2, offset: 2)

        then:
        taskListList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        taskListService.count() == 5
    }

    void "test delete"() {
        Long taskListId = setupData()

        expect:
        taskListService.count() == 5

        when:
        taskListService.delete(taskListId)
        sessionFactory.currentSession.flush()

        then:
        taskListService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        TaskList taskList = new TaskList()
        taskListService.save(taskList)

        then:
        taskList.id != null
    }
}
