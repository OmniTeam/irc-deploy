package com.kengamis.tasks

import com.kengamis.*
import groovy.json.JsonBuilder
import groovy.json.JsonSlurper
import groovyx.net.http.ContentType
import groovyx.net.http.HTTPBuilder
import groovyx.net.http.Method

class TaskListSyncJob extends Script {
    static def url = StartCamundaInstancesJob.camundaApiUrl

    @Override
    Object run() {
        runUserAccountTasks()
        handleArchiveTask()
        //send data to workflow
        def data = TaskList.where { status == 'completed' && synced == 'false' }.findAll()
        data.each { sendTasksToWorkflow(it as TaskList) }

        downloadTasks(url + '/get-tasks/CRVPF_REPORTING/','0/50')
        downloadTasks(url + '/get-tasks/GRANT_PROCESS/', '0/50')
        downloadTasks(url + '/get-tasks/LONG_TERM_GRANT/', '0/50')

        return null
    }

    static def saveTaskToDB(task, variables) {
        def status = "not_started"
        def synced = "false"

        TaskList.findByTaskId("${task['id']}") ?: new TaskList(
                taskId: "${task['id']}",
                userId: "${task['assigne']}",
                groupId: "${task['group']}",
                inputVariables: "$variables",
                outputVariables: "${task['outputs']}",
                status: status,
                taskName: "${task['name']}",
                processInstanceId: "${task['process_instance_id']}",
                processDefKey: "${task['process_def_key']}",
                synced: synced,
                taskDefinitionKey: "${task['task_definition_key']}",
        ).save(failOnError: true, flush: true)
    }

    static def downloadTasks(def uri, def path) {
        def path_end = ''
        def builder = new JsonBuilder()

        //receive from workflow
        try {
            def http = new HTTPBuilder(uri + path)
            http.headers.Accept = ContentType.JSON
            http.request(Method.GET, ContentType.JSON) {
                response.success = {
                    res, json ->
                        def tasklist = json['tasks']
                        def hasMore = json['hasMore']
                        def nextStart = json['nextStart']

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
                            downloadTasks(uri, path_end)
                        }
                }
            }
        } catch (Exception e) {
            println "Exception $e"
        }
    }

    def deleteCompletedTask(TaskList task) {
        Archive archive = new Archive()
        archive.taskId = task.taskId
        archive.inputVariables = task.inputVariables
        archive.outputVariables = task.outputVariables
        archive.status = task.status
        archive.formId = task.formId
        archive.groupId = task.groupId
        archive.userId = task.userId
        archive.taskName = task.taskName
        archive.processInstanceId = task.processInstanceId
        archive.processDefKey = task.processDefKey
        archive.synced = task.synced
        archive.taskDefinitionKey = task.taskDefinitionKey
        archive.save(flush: true, failOnError: true)
        TaskList.where { synced == 'true' && id == task.id }.deleteAll()
    }

    static setTaskSyncStatusToTrue(def id) {
        def taskList = TaskList.get(id)
        taskList.synced = 'true'
        taskList.save(failOnError: true, flush: true)
    }

    def sendTasksToWorkflow(TaskList task) {
        def output = '{"taskId": "' + task.taskId + '", "variables": ' + task.outputVariables + ' }'
        // POST
        try {
            def http = new HTTPBuilder(url + '/complete-task')
            http.headers.Accept = ContentType.JSON
            http.request(Method.POST, ContentType.JSON) { req ->
                body = output
                requestContentType = ContentType.JSON
                response.success = { resp, json ->
                    println "Camunda :: receivedOutputVariables() True [ ${json} ]"
                    setTaskSyncStatusToTrue(task.id)
                    this.deleteCompletedTask(task)
                }
                response.failure = { resp ->
                    println "Camunda :: receivedOutputVariables() False [ ${resp.status} ]"
                }
            }
        } catch (Exception e) {
            println "Exception $e"
        }
    }

    def runUserAccountTasks() {
        TaskList[] createUserAccountTask = TaskList.where { status == 'not_started' && taskDefinitionKey == 'Create_account_in_MIS' }.findAll()
        if (createUserAccountTask.size() > 0) {
            createUserAccountTask.each {
                createUser(it)
            }
        }

        TaskList[] deactivateUserAccountTask = TaskList.where { status == 'not_started' && taskDefinitionKey == 'Deactivate_account' }.findAll()
        if (deactivateUserAccountTask.size() > 0) {
            deactivateUserAccountTask.each {
                deactivateUser(it)
            }
        }

        TaskList[] createPartnerAccountTask = TaskList.where { status == 'not_started' && taskDefinitionKey == 'Create_partner_account' }.findAll()
        if (createPartnerAccountTask.size() > 0) {
            createPartnerAccountTask.each {
                createPartnerAccount(it)
            }
        }
    }

    def createUser(TaskList task) {
        def slurper = new JsonSlurper()
        def variables = slurper.parseText(task.inputVariables)

        variables['data'].each {
            if (it.key == 'GrantId') {
                GrantLetterOfInterest g = GrantLetterOfInterest.findById(it.value)
                Program program = Program.findById(g.program)
                def orgInfo = slurper.parseText(g.organisation)
                def email = orgInfo['email'] as String
                def names = orgInfo['names'] as String
                def username = generateCode(program != null ? program.title : "AP", generator(('0'..'9').join(), 4)) as String
                def password = generator((('A'..'Z') + ('0'..'9')).join(), 9) as String

                def user = new User(email: email, names: names, username: username, password: password)
                user.save(flush: true, failOnError: true)

                Role applicant = Role.findByAuthority("ROLE_APPLICANT")
                def role = new UserRole(user: user, role: applicant)
                role.save(flush: true, failOnError: true)

                println "New User created => username ${username}, password: ${password}"

                //update input variables with username and password for camunda to pick for email to the applicant
                // and also flag task as complete
                task.outputVariables = '{"ApplicantUserName": "' + username + '","ApplicantPassword": "' + password + '"}'
                task.status = 'completed'
                task.save(flush: true, failOnError: true)

                def value = '{"ApplicantUserName": "' + username + '","ApplicantPassword": "' + password + '"}'
                def temp = Temp.findByType("Applicant-${orgInfo['name']}")
                temp.jsonValue = value
                temp ? temp.save(flush: true, failOnError: true)
                        : new Temp(type: "Applicant-${orgInfo['name']}", jsonValue: value).save(flush: true, failOnError: true)
            }
        }
    }

    def createPartnerAccount(TaskList task) {
        def slurper = new JsonSlurper()
        def variables = slurper.parseText(task.inputVariables)

        variables['data'].each {
            if (it.key == 'GrantId') {
                GrantLetterOfInterest grant = GrantLetterOfInterest.findById(it.value)
                Program program = Program.findById(grant.program)
                def orgInfo = slurper.parseText(grant.organisation)
                def ngos = slurper.parseText(grant.ngos)
                def organizationsInvolved = []
                def dataCollector = getDataCollector()

                ngos.each {
                    organizationsInvolved << '{"id":"' + it['id'] + '","name":"' + it['nameOfPartnerOrganization'] + '","contact":"' + it['telephoneOfPartnerOrganization'] + '"}'
                }

                ProgramPartner p = new ProgramPartner()
                p.cluster = orgInfo['nameCluster'] as String
                p.organisation = orgInfo['name'] as String
                p.physicalAddress = orgInfo['physicalAddress'] as String
                p.organisationType = orgInfo['organizationType'] as String
                p.nameContactPerson = orgInfo['names'] as String
                p.telephoneContactPerson = orgInfo['contact'] as String
                p.emailContactPerson = orgInfo['email'] as String
                p.country = orgInfo['country'] as String
                p.city = orgInfo['city'] as String
                p.dataCollector = dataCollector ? dataCollector['user_id'] : ""
                p.areaOfOperation = orgInfo['areaOfOperation'] as String
                p.organisationsInvolved = organizationsInvolved
                p.program = program
                p.save(flush: true, failOnError: true)

                def username = generateCode(program?.title, generator(('0'..'9').join(), 4)) as String

                def oldUsername = getUserNameFromTempByType("Applicant-${orgInfo['name']}")
                User user = User.findByUsername(oldUsername)

                if (user != null) {
                    //update user role
                    def userRole = UserRole.findByUser(user)
                    if (userRole) UserRole.deleteOldRecords(user)
                    Role partnerRole = Role.findByAuthority("ROLE_PARTNER_DATA_MANAGER")
                    UserRole.create(user, partnerRole, true)

                    //update username
                    user.username = username
                    user.save(flush: true, failOnError: true)
                }

                println "New Partner created => cluster ${program?.title}, organization: ${orgInfo['name']}, username:  $username"

                task.status = 'completed'
                task.save(flush: true, failOnError: true)

                def temp = Temp.findByType("Applicant-${orgInfo['name']}")
                def value = "username ${username}, passwordFromRecord: ${temp?.id}"
                def temp2 = Temp.findByType("Partner-${orgInfo['name']}")
                temp2.jsonValue = value
                temp2 ? temp2.save(flush: true, failOnError: true)
                        : new Temp(type: "Partner-${orgInfo['name']}", jsonValue: value).save(flush: true, failOnError: true)
            }
        }
    }

    def deactivateUser(TaskList task) {
        def slurper = new JsonSlurper()
        def variables = slurper.parseText(task.inputVariables)

        variables['data'].each {
            if (it.key == 'GrantId') {
                GrantLetterOfInterest g = GrantLetterOfInterest.findById(it.value)
                def orgInfo = slurper.parseText(g.organisation)

                def username = getUserNameFromTempByType("Applicant-${orgInfo['name']}")
                User user = User.findByUsername(username)
                if (user != null) {
                    user.enabled = false
                    user.accountLocked = true
                    user.save(flush: true, failOnError: true)
                }
                task.status = 'completed'
                task.save(flush: true, failOnError: true)
            }
        }
    }

    def generator(String alphabet, int n) {
        return new Random().with {
            (1..n).collect { alphabet[nextInt(alphabet.length())] }.join()
        }
    }

    def getUserNameFromTempByType(String type) {
        def result = null
        def slurper = new JsonSlurper()
        def j = Temp.findByType(type)
        if (j != null) {
            def jsonValue = slurper.parseText(j['jsonValue'] as String)
            result = jsonValue['ApplicantUserName'] as String
        }
        return result
    }

    def generateCode(def prefix, def increment_value) {
        def actualIncrementValue = addingLeadingZerosToIncrement(increment_value)
        def code = prefix.toString() + '/' + actualIncrementValue.toString()
        return code
    }

    def addingLeadingZerosToIncrement(String increment_value) {
        def stringLength = 6
        def incrementValueLen = increment_value.toString().size()
        def expectedLen = stringLength.toInteger() - incrementValueLen.toInteger()
        for (def i = 0; i <= expectedLen - 1; i++) {
            increment_value = "0" + increment_value
        }
        return increment_value
    }

    def getDataCollector() {
        def query = "SELECT user_id, role.authority FROM `user_role` INNER JOIN role ON user_role.role_id = role.id WHERE role.authority ='ROLE_DATA_COLLECTOR' AND user_id NOT IN ( SELECT data_collector FROM `program_partner` ) LIMIT 1"
        def results = AppHolder.withMisSql { rows(query as String) }
        if (results.size() > 0) return results?.first() else return null
    }

    def handleArchiveTask() {
        def query = "SELECT * FROM task_list WHERE status = 'not_started' AND (task_definition_key = 'Archive_Report')"
        def forArchiving = AppHolder.withMisSql { rows(query as String) }
        if (forArchiving.size() > 0) {
            forArchiving.each { task ->
                Archive archive = new Archive()
                archive.taskId = task['task_id']
                archive.inputVariables = task['input_variables']
                archive.outputVariables = task['output_variables']
                archive.status = task['status']
                archive.formId = task['form_id']
                archive.groupId = task['group_id']
                archive.userId = task['user_id']
                archive.taskName = task['task_name']
                archive.processInstanceId = task['process_instance_id']
                archive.processDefKey = task['process_def_key']
                archive.synced = task['synced']
                archive.taskDefinitionKey = task['task_definition_key']
                archive.save(flush: true, failOnError: true)

                //complete the archived task
                TaskList taskList = TaskList.findById(task['id'] as String)
                taskList.status = 'completed'
                taskList.save(flush: true, failOnError: true)
            }
        }
    }

}
