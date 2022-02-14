package com.kengamis.tasks


import com.kengamis.TaskList
import groovy.json.JsonBuilder
import groovy.sql.Sql
import groovyx.net.http.ContentType
import groovyx.net.http.HTTPBuilder
import groovyx.net.http.Method

class TasklistSyncJob extends Script {
    Sql sql = sql
    static def url = StartCamundaInstancesJob.camundaApiUrl
    static def path = '/get-tasks/CRVPF_REPORTING/'

    @Override
    Object run() {
        downloadTasks(url + path + '0/50')
        return null
    }

    static def saveTaskToDB(task, variables) {
        def status = "not_started"
        def synced = "false"

        def taskList = TaskList.findByTaskId("${task['id']}") ?: new TaskList(
                taskId: "${task['id']}",
                userId: "${task['assigne']}",
                groupId: "${task['group']}",
                inputVariables: "${task['outputs']}",
                outputVariables: variables as String,
                status: status,
                taskName: "${task['name']}",
                processInstanceId: "${task['process_instance_id']}",
                processDefKey: "${task['process_def_key']}",
                synced: synced,
                taskDefinitionKey: "${task['task_definition_key']}",
        )
        TaskList.withNewTransaction { taskList.save(failOnError: true, flush: true) }
    }

    static def downloadTasks(def uri) {
        def path_end = ''
        def builder = new JsonBuilder()

        //receive from workflow
        try {
            def http = new HTTPBuilder(uri)
            http.headers.Accept = ContentType.JSON
            http.request(Method.GET, ContentType.JSON) {
                response.success = {
                    res, json ->
                        def tasklist = json['tasks']
                        def hasMore = json['hasMore']
                        def nextStart = json['nextStart']

                        println("................tasklist job connected to camunda................")

                        //Setting the parser type to JsonParserLax
                        tasklist.each { task ->
                            def returnedVariables = []
                            def variables = task['variables']
                            variables.each { v ->
                                def mapKey = v['key'].toString()
                                def mapValue = v['value'].toString().replace("'", "")
                                def mapType = v['type'].toString()
                                returnedVariables << ['KEY': mapKey, 'VALUE': mapValue, 'TYPE': mapType]
                            }

                            builder {
                                data(returnedVariables.collect { [key: it.KEY, value: it.VALUE, type: it.TYPE] })
                            }

                            saveTaskToDB(task, builder)
                        }

                        if (hasMore == true) {
                            path_end = nextStart + '/50'
                            downloadTasks(url + path + path_end)
                        }
                }
            }
        } catch (Exception e) {
            println "Exception $e"
        }
    }

    def deleteCompletedTask(def id) {
        TaskList.where {synced == 'true' && taskId == id }.deleteAll()
    }

    def setTaskSyncStatusToTrue(def id) {
        def taskList = TaskList.findByTaskId(id.toString())
        taskList(synced: 'true').save(failOnError: true, flush: true)
    }

    def completeTask() {
        def _processInstanceId = (String) request.getJSON().processInstanceId
        def _taskDefKey = (String) request.getJSON().taskDefKey
        println("$processInstanceId, $taskDefKey")
        def taskListRecord = new TaskList()

        def existingTaskInTaskList = TaskList.where {processInstanceId == _processInstanceId && taskDefinitionKey == _taskDefKey}.get()

        if (existingTaskInTaskList) {
            taskListRecord = existingTaskInTaskList
            taskListRecord.status = "completed"
            taskListRecord.save(failOnError: true, flush: true)
        }
    }

}
