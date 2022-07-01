package com.kengamis.tasks

import com.kengamis.*
import com.kengamis.acl.KengaGroupAclEntryService
import groovy.json.JsonBuilder
import groovy.json.JsonSlurper
import groovyx.net.http.ContentType
import groovyx.net.http.HTTPBuilder
import groovyx.net.http.Method

class TaskListSyncJob extends Script {
    static def url = StartCamundaInstancesJob.camundaApiUrl
    EntityViewFilterQueryService entityViewFilterQueryService
    KengaGroupAclEntryService kengaGroupAclEntryService

    @Override
    Object run() {
        runUserAccountTasks()
        handleArchiveTask()
        startLongTermGrantJob()
        //send data to workflow
        def data = TaskList.where { status == 'completed' && synced == 'false' }.findAll()
        data.each { sendTasksToWorkflow(it as TaskList) }

        downloadTasks(url + '/get-tasks/CRVPF_REPORTING/', '0/50')
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

    static def startLongTermGrantJob() {
        TaskList[] longTermGrantTask = TaskList.where { status == 'not_started' && taskDefinitionKey == 'Start_Long_Term_Grant' }.findAll()
        if (longTermGrantTask.size() > 0) {
            longTermGrantTask.each { TaskList task ->
                def slurper = new JsonSlurper()
                def variables = slurper.parseText(task.inputVariables)

                variables['data'].each { it ->
                    if (it.key == 'GrantId') {
                        if (startLongTermGrant(it.value)) {
                            task.status = 'completed'
                            task.save(flush: true, failOnError: true)
                        }
                    }
                }
            }
        }
    }

    static boolean startLongTermGrant(String grantId) {
        boolean started = false
        GrantLetterOfInterest grant = GrantLetterOfInterest.findById(grantId)

        def r = AppHolder.withMisSql { rows(StartCamundaInstancesJob.queryUserRoles.toString()) }

        try {
            if (r.size() > 0) {
                def slurper = new JsonSlurper()
                def orgInfo = slurper.parseText(grant.organisation)
                def applicantEmail = orgInfo['email'] as String
                def applicantName = orgInfo['names'] as String
                def organization = orgInfo['name'] as String
                def edEmail = []
                def programTeamEmail = []
                def program = Program.get(grant.program)

                def applicant = Applicant.findByOrganization(organization)

                r.each {
                    if (it['role'] == "ROLE_ED") edEmail << it['email']
                    if (it['role'] == "ROLE_PROGRAM_OFFICER" && it['group_program'] == program.title) programTeamEmail << it['email']
                }
                if (grant) {
                    started = StartCamundaInstancesJob.startProcessInstance([
                            GrantId          : grant.id,
                            ApplicantName    : applicantName,
                            Organization     : organization,
                            Applicant        : applicantEmail,
                            ApplicantUserName: applicant.username,
                            ApplicantPassword: applicant.password,
                            ProgramTeam      : programTeamEmail[0],
                            ExecutiveDirector: edEmail[0],
                    ], "LONG_TERM_GRANT")

                    if (started) {
                        println "=========Started long term grant instance ========="
                        grant.status = "started-longterm"
                        grant.save(flush: true, failOnError: true)
                    }
                }
            }
        } catch (e) {
            e.printStackTrace()
        }
        return started
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
                def nUser = createUserAccount(it.value)
                //update input variables with username and password for camunda to pick for email to the applicant
                // and also flag task as complete
                task.outputVariables = '{"ApplicantUserName": "' + nUser.username + '","ApplicantPassword": "' + nUser.password + '"}'
                task.status = 'completed'
                task.save(flush: true, failOnError: true)
            }
        }
    }

    static def createUserAccount(String grantId) {
        def slurper = new JsonSlurper()
        GrantLetterOfInterest g = GrantLetterOfInterest.findById(grantId)
        Program program = Program.findById(g.program)
        def orgInfo = slurper.parseText(g.organisation)
        def email = orgInfo['email'] as String
        def names = orgInfo['names'] as String
        def orgName = orgInfo['name'] as String
        def username = generateCode(program != null ? program.title : "AP", generator(('0'..'9').join(), 4)) as String
        def password = generator((('A'..'Z') + ('0'..'9')).join(), 9) as String

        def user = new User(email: email, names: names, username: username, password: password)
        user.save(flush: true, failOnError: true)

        Role applicantRole = Role.findByAuthority("ROLE_APPLICANT")
        def role = new UserRole(user: user, role: applicantRole)
        role.save(flush: true, failOnError: true)

        Applicant applicant = new Applicant(username: username, password: password, grantId: g.id, email: email, names: names, organization: orgName, user: user)
        applicant.save(flush: true, failOnError: true)
        println "New User created => username ${username}, password: ${password}"

        return [username: username, password: password]
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

                Applicant applicant = Applicant.findByOrganization(orgInfo['name'] as String)
                if (applicant != null) {
                    //Creat program partner
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

                    //update user role
                    User user = applicant.user
                    def userRole = UserRole.findByUser(user)
                    if (userRole) UserRole.deleteOldRecords(user)
                    Role partnerRole = Role.findByAuthority("ROLE_PARTNER_DATA_MANAGER")
                    UserRole.create(user, partnerRole, true)

                    println "New Partner created => cluster ${program?.title}, organization: ${orgInfo['name']}, username:  ${applicant.username}"

                    task.status = 'completed'
                    task.save(flush: true, failOnError: true)

                    def entityDataCollectorId = p.dataCollector
                    def clusterName = p.cluster


                    // create  a group. Check if the group already exist. Otherwise retrieve that group and use it for creating other stuff eg Acls
                    if (!KengaGroup.findByName(clusterName)) {
                        def parentGroup = KengaGroup.findByName(p.program.title)
                        def kengaGroup = KengaGroup.create(parentGroup, clusterName)

                        def createdGroupName = kengaGroup.name
                        def createdGroupId = kengaGroup.id

                        createEntityViewFilters(createdGroupName, entityDataCollectorId)
                        createAcls(createdGroupName, createdGroupId)
                    } else {
                        def existingGroup = KengaGroup.findByName(p.cluster)
                        def existingGroupName = existingGroup.name
                        def existingGroupId = existingGroup.id

                        createEntityViewFilters(existingGroupName, entityDataCollectorId)
                        createAcls(existingGroupName, existingGroupId)
                    }

                } else {
                    print "Applicant Does Not exist"
                }
            }
        }
    }

    def createAcls(clusterName, groupId) {
        //  will hold the queryArray
        def queryArray = []

        // queries
        def formConditionalQuery = "where cluster = '${clusterName}'"
        def entityConditionalQuery = "where _cluster = '${clusterName}'"

        // first collect the  form and entity names
        def listOfFormNames = Form.all.collect {
            if (it.enabled) {
                it.name
            }
        }

        listOfFormNames?.each {
            def obj = new LinkedHashMap();
            obj['form'] = it
            obj['groupConditionQuery'] = formConditionalQuery
            queryArray << obj
        }

        def listOfEntityBeneficiaries = ['entity_beneficiary_list']
        listOfEntityBeneficiaries?.each {
            def obj = new LinkedHashMap();
            obj['form'] = it
            obj['groupConditionQuery'] = entityConditionalQuery
            queryArray << obj
        }

        kengaGroupAclEntryService.saveGroupMappings(groupId, 1, queryArray)
    }

    def createEntityViewFilters(createdGroupName, entityDataCollectorId) {
        def listOfEntityViews = EntityView.all
        listOfEntityViews.each {
            def entityViewFilterName = createdGroupName + ' ' + it.name
            def entityViewId = it.id
            def entityViewFilterQuery = (entityViewFilterQueryService.generateFullFilterQuery(it.name, createdGroupName).viewQuery).toString()
            def entityViewFilterUser = entityDataCollectorId

            // create the entity view filter
            def entityViewFilters = EntityViewFilters.create(entityViewFilterName, entityViewFilterQuery, entityViewId)

            // save the data collectors
            if (entityViewFilterUser) {
                def entityDataViewFilterCollector = User.findById(entityViewFilterUser)
                def entityViewObject = EntityViewFilters.findById(entityViewFilters.id)
                UserEntityViewFilters.createUserEntityViewFilters(entityDataViewFilterCollector, entityViewObject)
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

                Applicant applicant = Applicant.findByOrganization(orgInfo['name'] as String)
                User user = applicant.user
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

    static def generator(String alphabet, int n) {
        return new Random().with {
            (1..n).collect { alphabet[nextInt(alphabet.length())] }.join()
        }
    }

    static def generateCode(def prefix, def increment_value) {
        def actualIncrementValue = addingLeadingZerosToIncrement(increment_value)
        def code = prefix.toString() + '/' + actualIncrementValue.toString()
        return code
    }

    static def addingLeadingZerosToIncrement(String increment_value) {
        def stringLength = 6
        def incrementValueLen = increment_value.toString().size()
        def expectedLen = stringLength.toInteger() - incrementValueLen.toInteger()
        for (def i = 0; i <= expectedLen - 1; i++) {
            increment_value = "0" + increment_value
        }
        return increment_value
    }

    def getDataCollector() {
        def dataCollectors = []
        def query = "SELECT user_id, role.authority FROM `user_role` INNER JOIN role ON user_role.role_id = role.id WHERE role.authority ='ROLE_DATA_COLLECTOR' AND user_id NOT IN ( SELECT data_collector FROM `program_partner` )"
        def results = AppHolder.withMisSql { rows(query as String) }
        if (results.size() > 0) {
            results.each {
                User user = User.findById(it['user_id'] as String)
                if (this.firstTwo(user.username) == "PR") dataCollectors << it
            }
        }
        return dataCollectors.first()
    }

    def firstTwo(String str) {
        return str.length() < 2 ? str : str.substring(0, 2);
    }

    static def handleArchiveTask() {
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
