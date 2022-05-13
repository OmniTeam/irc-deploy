package com.kengamis

import fuzzycsv.FuzzyCSVTable
import grails.gorm.transactions.ReadOnly
import grails.gorm.transactions.Transactional
import grails.validation.ValidationException
import groovy.json.JsonBuilder
import groovy.json.JsonSlurper

import static org.springframework.http.HttpStatus.*

@ReadOnly
class TaskListController {

    TaskListService taskListService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        def tasks = []

        TaskList.findAllByStatusNotEqual('completed').each { TaskList task ->
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

            def taskPartner = ProgramPartner.findById(partnerId)
            def taskProgram = Program.findById(programId)

            if (taskPartner == null) taskPartner = [name: '']
            if (taskProgram == null) taskProgram = [title: '']

            User currentUser = AppHolder.currentUser()
            def userRoles = UserRole.findAllByUser(currentUser).collect { it.role.authority }.join(",")
            def query = "SELECT USER.id AS user_id, user_partner.program_partner_id as partner_id, program_partner.program_id FROM user INNER JOIN user_partner ON user_partner.user_id = USER.id INNER JOIN program_partner ON program_partner.id = user_partner.program_partner_id WHERE user.id = '${currentUser.id}' "
            def userPartnerProgram = AppHolder.withMisSql { rows(query.toString()) }

            def userPartner = '', userProgram = ''
            if (userPartnerProgram.size() > 0) {
                userPartner = userPartnerProgram.collect { it['partner_id'] }.join(",")
                userProgram = userPartnerProgram.collect { it['program_id'] }.join(",")
            }


            //def c1 = userGroup.contains(groupId)
            boolean c2 = false
            if (task.taskDefinitionKey == "Review_Program_Report" || task.taskDefinitionKey == "Approve_Report") {
                def currentUserGroup = KengaUserGroup.findAllByUser(currentUser).collect { it.kengaGroup.name }.join(",")
                if (userRoles.contains("ROLE_PROGRAM_OFFICER")) c2 = currentUserGroup.contains(taskProgram.title)
            } else if (task.taskDefinitionKey == "Submit_Report" || task.taskDefinitionKey == "Submit_Final_Report") {
                c2 = userPartner.contains(partnerId) && userProgram.contains(programId)
            } else if (task.taskDefinitionKey == "Review_Performance_Report") {
                c2 = userRoles.contains("ROLE_MEAL")
            } else if (task.taskDefinitionKey == "Review_Finance_Report" || task.taskDefinitionKey == "Disburse_Funds") {
                c2 = userRoles.contains("ROLE_FINANCE")
            } else if (task.taskDefinitionKey == "Approve_Fund_Disbursement") {
                c2 = userRoles.contains("ROLE_ED")
            }

            boolean c3 = userRoles.contains("ROLE_SUPER_ADMIN")

            if (c2 || c3) {
                tasks << [id               : task.id,
                          taskName         : task.taskName,
                          partnerSetupId   : partnerSetupId,
                          startDate        : startDate,
                          partnerId        : partnerId,
                          partnerName      : taskPartner.name,
                          programId        : programId,
                          grantId          : grantId,
                          programName      : taskProgram.title,
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

        if (programPartner == null) programPartner = [name: '']
        if (program == null) program = [title: '']

        def t = [id               : task.id,
                 taskName         : task.taskName,
                 partnerSetupId   : partnerSetupId,
                 startDate        : startDate,
                 partnerId        : partnerId,
                 partnerName      : programPartner.name,
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
}
