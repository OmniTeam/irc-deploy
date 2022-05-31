package com.kengamis

import grails.gorm.transactions.ReadOnly
import grails.gorm.transactions.Transactional
import grails.validation.ValidationException
import groovy.json.JsonSlurper

import static org.springframework.http.HttpStatus.*

@ReadOnly
class TaskListController {

    TaskListService taskListService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        def tasks = []

        //archive reports
        archiveReport()

        TaskList.findAllByStatusNotEqual('completed').each { TaskList task ->
            def slurper = new JsonSlurper()
            def variables = slurper.parseText(task.inputVariables)
            def workPlanId = '', startDate = '', staffId = '', programId = '', endDate = '', groupId = '', period = '', referralId = '', activityId = '', feedbackId = ''

            variables['data'].each {
                if (it.key == 'PartnerSetupId') workPlanId = it.value
                if (it.key == 'Period') period = it.value
                if (it.key == 'StartDate') startDate = it.value
                if (it.key == 'PartnerId') staffId = it.value
                if (it.key == 'ProgramId') programId = it.value
                if (it.key == 'EndDate') endDate = it.value
                if (it.key == 'ReferralId') referralId = it.value
                if (it.key == 'ActivityId') activityId = it.value
                if (it.key == 'FeedbackId') feedbackId = it.value
                if (it.key == 'GroupId') groupId = it.value
            }

            def taskPartner = ProgramStaff.findById(staffId)
            def taskProgram = Program.findById(programId)

            if (taskPartner == null) taskPartner = [name: '']
            if (taskProgram == null) taskProgram = [title: '']

            User currentUser = AppHolder.currentUser()
            def userRoles = UserRole.findAllByUser(currentUser).collect { it.role.authority }.join(",")
            def assignee = ''
            def taskCase = ''

            def referral = Referral.findById(referralId)
            if (referralId != null && referral != null) {
                assignee = referral.assignee
                taskCase = referral.organizationReferredTo
            }

            def activityReport = ActivityReport.findById(activityId)
            if (activityId != null && activityReport != null) {
                assignee = activityReport.assignee
                taskCase = activityReport.activityName
            }

            def feedback = Feedback.findById(feedbackId)
            if (feedbackId != null && feedback != null) {
                assignee = feedback.assignee
                taskCase = feedback.typeOfFeedback
            }

            if (task.processDefKey == 'PROGRESS_REPORTING') {
                def staff = User.findById(staffId)
                taskCase = staff ?  "$period - ${staff.names}" : "$period"
                assignee = staff.email
            }

            boolean c2 = userRoles.contains("ROLE_SUPER_ADMIN")

            if (assignee == currentUser.email || c2)
                tasks << [id               : task.id,
                          taskName         : task.taskName,
                          workPlanId       : workPlanId,
                          startDate        : startDate,
                          staffId          : staffId,
                          partnerName      : taskPartner.name,
                          programId        : programId,
                          programName      : taskProgram.title,
                          endDate          : endDate,
                          groupId          : groupId,
                          reportingPeriod  : period,
                          referralId       : referralId,
                          activityId       : activityId,
                          feedbackId       : feedbackId,
                          case             : taskCase,
                          assignee         : User.findByEmail(assignee)?.names,
                          processDefKey    : task.processDefKey,
                          outputVariables  : task.outputVariables,
                          processInstanceId: task.processInstanceId,
                          taskDefinitionKey: task.taskDefinitionKey,
                          dateCreated      : task.dateCreated,
                          status           : task.status]
        }
        respond tasks
    }

    def getTaskRecord() {
        def task = TaskList.get(params.id)

        if (task == null) {
            respond 'No values for this task id'
            return
        }

        def slurper = new JsonSlurper()
        def variables = slurper.parseText(task.inputVariables)
        def workPlanId = '', startDate = '', staffId = '', programId = '', endDate = '', groupId = '', period = '', referralId = '', activityId = '', feedbackId = ''

        variables['data'].each {
            if (it.key == 'PartnerSetupId') workPlanId = it.value
            if (it.key == 'Period') period = it.value
            if (it.key == 'StartDate') startDate = it.value
            if (it.key == 'PartnerId') staffId = it.value
            if (it.key == 'ProgramId') programId = it.value
            if (it.key == 'ReferralId') referralId = it.value
            if (it.key == 'ActivityId') activityId = it.value
            if (it.key == 'FeedbackId') feedbackId = it.value
            if (it.key == 'EndDate') endDate = it.value
            if (it.key == 'GroupId') groupId = it.value
        }

        def programPartner = ProgramStaff.findById(staffId)
        def program = Program.findById(programId)

        if (programPartner == null) programPartner = [name: '']
        if (program == null) program = [title: '']

        User currentUser = AppHolder.currentUser()
        def userRoles = UserRole.findAllByUser(currentUser).collect { it.role.authority }.join(",")
        def assignee = ''
        def taskCase = ''

        def referral = Referral.findById(referralId)
        if (referralId != null && referral != null) {
            assignee = referral.assignee
            taskCase = referral.organizationReferredTo
        }

        def activityReport = ActivityReport.findById(activityId)
        if (activityId != null && activityReport != null) {
            assignee = activityReport.assignee
            taskCase = activityReport.milestone
        }

        def feedback = Feedback.findById(feedbackId)
        if (feedbackId != null && feedback != null) {
            assignee = feedback.assignee
            taskCase = feedback.typeOfFeedback
        }

        boolean c2 = userRoles.contains("ROLE_SUPER_ADMIN")

        def t = null
        if (assignee == currentUser.email || c2)
            t = [id               : task.id,
                 taskName         : task.taskName,
                 workPlanId       : workPlanId,
                 startDate        : startDate,
                 staffId          : staffId,
                 partnerName      : programPartner.name,
                 programId        : programId,
                 programName      : program.title,
                 endDate          : endDate,
                 groupId          : groupId,
                 referralId       : referralId,
                 activityId       : activityId,
                 feedbackId       : feedbackId,
                 case             : taskCase,
                 reportingPeriod  : period,
                 assignee         : User.findByEmail(assignee)?.names,
                 processDefKey    : task.processDefKey,
                 outputVariables  : task.outputVariables,
                 processInstanceId: task.processInstanceId,
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
        println taskList.errors
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
