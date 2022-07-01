package com.kengamis

import com.kengamis.acl.KengaGroupAclEntry
import com.kengamis.acl.KengaGroupAclEntryService
import com.kengamis.tasks.StartCamundaInstancesJob
import grails.gorm.transactions.Transactional
import grails.validation.ValidationException
import groovy.json.*

import static org.springframework.http.HttpStatus.*

@Transactional
class TaskListController {

    TaskListService taskListService
    EntityViewFilterQueryService entityViewFilterQueryService
    KengaGroupAclEntryService kengaGroupAclEntryService

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index() {
        def tasks = []

        TaskList.findAllByStatusNotEqual('completed').each { TaskList task ->
            def slurper = new JsonSlurper()
            def variables = slurper.parseText(task.inputVariables)
            def partnerSetupId = '', startDate = '', partnerId = '', programId = '', endDate = '', groupId = '', period = '', grantId = '', applicationId = ''

            variables['data'].each {
                if (it.key == 'PartnerSetupId') partnerSetupId = it.value
                if (it.key == 'Period') period = it.value
                if (it.key == 'StartDate') startDate = it.value
                if (it.key == 'PartnerId') partnerId = it.value
                if (it.key == 'GrantId') grantId = it.value
                if (it.key == 'ApplicationId') applicationId = it.value
                if (it.key == 'ProgramId') programId = it.value
                if (it.key == 'EndDate') endDate = it.value
                if (it.key == 'GroupId') groupId = it.value
            }

            def taskPartner = ProgramPartner.findById(partnerId)
            def taskProgram = Program.findById(programId)

            if (taskPartner == null) taskPartner = [cluster: '']
            if (taskProgram == null) taskProgram = [title: '']

            def grant = GrantLetterOfInterest.findById(grantId)
            def orgInfo = {}
            if (grant != null) orgInfo = slurper.parseText(grant.organisation)

            User currentUser = AppHolder.currentUser()
            def userRoles = UserRole.findAllByUser(currentUser).collect { it.role.authority }.join(",")
            def query = "SELECT USER.id AS user_id, user_partner.program_partner_id as partner_id, program_partner.program_id FROM user INNER JOIN user_partner ON user_partner.user_id = USER.id INNER JOIN program_partner ON program_partner.id = user_partner.program_partner_id WHERE user.id = '${currentUser.id}' "
            def userPartnerProgram = AppHolder.withMisSql { rows(query.toString()) }

            def userPartner = '', userProgram = ''
            if (userPartnerProgram.size() > 0) {
                userPartner = userPartnerProgram.collect { it['partner_id'] }.join(",")
                userProgram = userPartnerProgram.collect { it['program_id'] }.join(",")
            }

            def currentUserGroup = KengaUserGroup.findAllByUser(currentUser).collect { it.kengaGroup.name }.join(",")
            def casee = ''
            def assignee = ''

            //def c1 = userGroup.contains(groupId)
            boolean c2 = false
            if (task.processDefKey == "CRVPF_REPORTING") {
                if (task.taskDefinitionKey == "Review_Program_Report" || task.taskDefinitionKey == "Approve_Report") {
                    assignee = "PROGRAM_OFFICER"
                    if (userRoles.contains("ROLE_PROGRAM_OFFICER")) c2 = currentUserGroup.contains(taskProgram.title)
                } else if (task.taskDefinitionKey == "Submit_Report" || task.taskDefinitionKey == "Submit_Final_Report") {
                    assignee = "${taskPartner.cluster}-${taskProgram.title}"
                    c2 = userPartner.contains(partnerId) && userProgram.contains(programId) && userRoles.contains("ROLE_PARTNER_DATA_MANAGER")
                } else if (task.taskDefinitionKey == "Review_Performance_Report") {
                    assignee = "MEAL"
                    c2 = userRoles.contains("ROLE_MEAL")
                } else if (task.taskDefinitionKey == "Review_Finance_Report" || task.taskDefinitionKey == "Disburse_Funds") {
                    assignee = "FINANCE"
                    c2 = userRoles.contains("ROLE_FINANCE")
                } else if (task.taskDefinitionKey == "Approve_Fund_Disbursement") {
                    assignee = "Executive Director"
                    c2 = userRoles.contains("ROLE_ED")
                }
                casee = taskPartner?.cluster
            } else if (task.processDefKey == "GRANT_PROCESS") {
                if (task.taskDefinitionKey == "Review_and_Conduct_Due_Diligence" ||
                        task.taskDefinitionKey == "Review_Concept" ||
                        task.taskDefinitionKey == "Review_Report") {
                    assignee = "PROGRAM_OFFICER"
                    if (userRoles.contains("ROLE_PROGRAM_OFFICER")) c2 = currentUserGroup.contains(taskProgram.title)
                } else if (task.taskDefinitionKey == "Provide_Learning_Grant") {
                    assignee = "FINANCE"
                    c2 = userRoles.contains("ROLE_FINANCE")
                } else if (task.taskDefinitionKey == "Approve_Learning_Grant") {
                    assignee = "Executive Director"
                    c2 = userRoles.contains("ROLE_ED")
                } else if (task.taskDefinitionKey == "Apply_for_Learning_Planning_Grant" ||
                        task.taskDefinitionKey == "Submit_Report" ||
                        task.taskDefinitionKey == "Make_Corrections") {
                    assignee = "APPLICANT"
                    if (userRoles.contains("ROLE_APPLICANT")) {
                        def applicantEmail = ''
                        if (grant != null) applicantEmail = orgInfo['email']
                        c2 = (applicantEmail == currentUser.email)
                    }
                }

                if (grant != null) casee = orgInfo['name']
                startDate = grant?.dateCreated
                endDate = grant?.lastUpdated
            } else if (task.processDefKey == "LONG_TERM_GRANT") {
                if (task.taskDefinitionKey == "Submit_Long_Term_Grant" ||
                        task.taskDefinitionKey == "Make_Revisions_On_Application") {
                    assignee = "APPLICANT"
                    if (userRoles.contains("ROLE_APPLICANT")) {
                        def applicantEmail = ''
                        if (grant != null) applicantEmail = orgInfo['email']
                        c2 = (applicantEmail == currentUser.email)
                    }
                }
                if (task.taskDefinitionKey == "Review_Long-term_Grant_Application" ||
                        task.taskDefinitionKey == "Review_Revised_Application" ||
                        task.taskDefinitionKey == "Make_Revisions_From_ED") {
                    assignee = "FINANCE"
                    c2 = userRoles.contains("ROLE_FINANCE")
                }
                if (task.taskDefinitionKey == "Approve_Application") {
                    assignee = "Executive Director"
                    c2 = userRoles.contains("ROLE_ED")
                }
                if (task.taskDefinitionKey == "Sign_Agreement") {
                    assignee = "PROGRAM_OFFICER"
                    c2 = userRoles.contains("ROLE_PROGRAM_OFFICER")
                }
                if (grant != null) casee = orgInfo['name']
                startDate = grant?.dateCreated
                endDate = grant?.lastUpdated
            }

            boolean c3 = userRoles.contains("ROLE_SUPER_ADMIN")

            if (c2 || c3) {
                tasks << [id               : task.id,
                          taskName         : task.taskName,
                          partnerSetupId   : partnerSetupId,
                          startDate        : startDate,
                          partnerId        : partnerId,
                          partnerName      : taskPartner.cluster,
                          programId        : programId,
                          grantId          : grantId,
                          programName      : taskProgram.title,
                          case             : casee,
                          assignee         : assignee,
                          endDate          : endDate,
                          groupId          : groupId,
                          reportingPeriod  : period,
                          outputVariables  : task.outputVariables,
                          processInstanceId: task.processInstanceId,
                          processDefKey    : task.processDefKey,
                          taskDefinitionKey: task.taskDefinitionKey,
                          dateCreated      : task.dateCreated,
                          status           : task.status]
            }
        }
        respond tasks
    }

    def getTaskRecord() {
        def task = TaskList.get(params.id)

        def slurper = new JsonSlurper()
        def variables = slurper.parseText(task.inputVariables)
        def partnerSetupId = '', startDate = '', partnerId = '', programId = '', endDate = '', groupId = '', period = '', grantId = ''

        variables['data'].each {
            if (it.key == 'PartnerSetupId') partnerSetupId = it.value
            if (it.key == 'Period') period = it.value
            if (it.key == 'StartDate') startDate = it.value
            if (it.key == 'PartnerId') partnerId = it.value
            if (it.key == 'GrantId') grantId = it.value
            if (it.key == 'ProgramId') programId = it.value
            if (it.key == 'EndDate') endDate = it.value
            if (it.key == 'GroupId') groupId = it.value
        }

        def programPartner = ProgramPartner.findById(partnerId)
        def program = Program.findById(programId)

        if (programPartner == null) programPartner = [cluster: '']
        if (program == null) program = [title: '']

        def t = [id               : task.id,
                 taskName         : task.taskName,
                 partnerSetupId   : partnerSetupId,
                 startDate        : startDate,
                 partnerId        : partnerId,
                 partnerName      : programPartner.cluster,
                 programId        : programId,
                 grantId          : grantId,
                 programName      : program.title,
                 endDate          : endDate,
                 groupId          : groupId,
                 reportingPeriod  : period,
                 outputVariables  : task.outputVariables,
                 processInstanceId: task.processInstanceId,
                 processDefKey    : task.processDefKey,
                 taskDefinitionKey: task.taskDefinitionKey,
                 dateCreated      : task.dateCreated,
                 status           : task.status]
        respond t
    }

    def show(Long id) {
        respond taskListService.get(id)
    }

    @Transactional
    def save(TaskList taskList) {
        if (taskList == null) {
            render status: NOT_FOUND
            return
        }
        if (taskList.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond taskList.errors
            return
        }

        try {
            taskListService.save(taskList)
        } catch (ValidationException e) {
            respond taskList.errors
            return
        }

        respond taskList, [status: CREATED, view: "show"]
    }

    @Transactional
    def update(TaskList taskList) {
        if (taskList == null) {
            render status: NOT_FOUND
            return
        }
        if (taskList.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond taskList.errors
            return
        }

        try {
            taskListService.save(taskList)
        } catch (ValidationException e) {
            respond taskList.errors
            return
        }

        respond taskList, [status: OK, view: "show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        taskListService.delete(id)

        render status: NO_CONTENT
    }

    @Transactional
    def startLongTermGrantJob() {
        TaskList[] startLongTermGrant = TaskList.where { status == 'not_started' && taskDefinitionKey == 'Start_Long_Term_Grant' }.findAll()
        if (startLongTermGrant.size() > 0) {
            startLongTermGrant.each { TaskList task ->
                def slurper = new JsonSlurper()
                def variables = slurper.parseText(task.inputVariables)

                variables['data'].each { it ->
                    if (it.key == 'GrantId') {
                        GrantLetterOfInterest grant = GrantLetterOfInterest.findById(it.value)

                        def r = AppHolder.withMisSql { rows(StartCamundaInstancesJob.queryUserRoles.toString()) }

                        try {
                            if (r.size() > 0) {
                                def orgInfo = slurper.parseText(grant.organisation)
                                def applicantEmail = orgInfo['email']
                                def applicantName = orgInfo['names']
                                def organization = orgInfo['name']
                                def edEmail = []
                                def programTeamEmail = []
                                def program = Program.get(grant.program)

                                r.each {
                                    if (it['role'] == "ROLE_ED") edEmail << it['email']
                                    if (it['role'] == "ROLE_PROGRAM_OFFICER" && it['group_program'] == program.title) programTeamEmail << it['email']
                                }
                                if (grant) {
                                    boolean started = StartCamundaInstancesJob.startProcessInstance([
                                            GrantId          : grant.id,
                                            ApplicantName    : applicantName,
                                            Organization     : organization,
                                            Applicant        : applicantEmail,
                                            ApplicantUserName: applicantEmail,
                                            ApplicantPassword: applicantEmail,
                                            ProgramTeam      : programTeamEmail[0],
                                            ExecutiveDirector: edEmail[0],
                                    ], "LONG_TERM_GRANT")

                                    if (started) {
                                        println "=========Started long term grant instance ========="
                                        grant.status = "started-longterm"
                                        grant.save(flush: true, failOnError: true)

                                        task.status = 'completed'
                                        task.save(flush: true, failOnError: true)
                                    }
                                }
                            }
                        } catch (e) {
                            e.printStackTrace()
                        }
                    }
                }
                task.status = 'completed'
                task.save(flush: true, failOnError: true)

                def temp = Temp.findByType("Applicant-${orgInfo['name']}")
                new Temp(type: "Partner-${orgInfo['name']}", jsonValue: "username ${username}, passwordFromRecord: ${temp?.id}").save()

                def entityDataCollectorId = p.dataCollector
                def clusterName = p.cluster


                // create  a group. Check if the group already exist. Otherwise retrieve that group and use it for creating other stuff eg Acls
                if(!KengaGroup.findByName(clusterName)){
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
            }
        }
    }

    def createAcls(clusterName, groupId){
        //  will hold the queryArray
        def queryArray = []

        // queries
        def formConditionalQuery = "where cluster = '${clusterName}'"
        def entityConditionalQuery = "where _cluster = '${clusterName}'"

        // first collect the  form and entity names
        def listOfFormNames = Form.all.collect {
            if (it.enabled) {it.name}
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

    @Transactional
    def createEntityViewFilters(createdGroupName, entityDataCollectorId){
        def listOfEntityViews = EntityView.all
        listOfEntityViews.each {
            def entityViewFilterName = createdGroupName + ' ' + it.name
            def entityViewId = it.id
            def entityViewFilterQuery = (entityViewFilterQueryService.generateFullFilterQuery( it.name, createdGroupName).viewQuery).toString()
            def entityViewFilterUser = entityDataCollectorId

            // create the entity view filter
            def entityViewFilters = EntityViewFilters.create(entityViewFilterName,entityViewFilterQuery,entityViewId)

            // save the data collectors
            if(entityViewFilterUser){
                def entityDataViewFilterCollector = User.findById(entityViewFilterUser)
                def entityViewObject = EntityViewFilters.findById(entityViewFilters.id)
                UserEntityViewFilters.createUserEntityViewFilters(entityDataViewFilterCollector, entityViewObject)
            }
        }

    }


    @Transactional
    def deactivateUser(TaskList task) {
        def slurper = new JsonSlurper()
        def variables = slurper.parseText(task.inputVariables)

        variables['data'].each {
            if (it.key == 'GrantId') {
                GrantLetterOfInterest g = GrantLetterOfInterest.findById(it.value)
                def orgInfo = slurper.parseText(g.organisation)
                def email = orgInfo['email'] as String

                def user = User.findByEmail(email)
                if (user != null) {
                    user.enabled = false
                    user.save(flush: true, failOnError: true)
                }
                task.status = 'completed'
                task.save(flush: true, failOnError: true)
            }
        }
    }


    def generateCode(def prefix, def increment_value) {
        def actualIncrementValue = addingLeadingZerosToIncrement(increment_value)
        def code = prefix.toString() + '/' + actualIncrementValue.toString()
        return code
    }

    def addingLeadingZerosToIncrement(def increment_value) {
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

    @Transactional
    def archiveReport() {
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
