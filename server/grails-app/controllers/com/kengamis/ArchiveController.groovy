package com.kengamis

import grails.gorm.transactions.ReadOnly
import grails.gorm.transactions.Transactional
import grails.validation.ValidationException
import groovy.json.JsonSlurper

import static org.springframework.http.HttpStatus.*

@ReadOnly
class ArchiveController {

    ArchiveService archiveService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        def records = []

        Archive.all.each { Archive record ->
            def slurper = new JsonSlurper()
            def variables = slurper.parseText(record.inputVariables)
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

            if (record.processDefKey == 'PROGRESS_REPORTING') {
                def staff = User.findById(staffId)
                taskCase = staff ?  "$period - ${staff.names}" : "$period"
                assignee = staff.email
            }

            boolean c2 = userRoles.contains("ROLE_SUPER_ADMIN")

            if (assignee == currentUser.email || c2)
                records << [id               : record.id,
                          taskName         : record.taskName,
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
                          processDefKey    : record.processDefKey,
                          outputVariables  : record.outputVariables,
                          processInstanceId: record.processInstanceId,
                          taskDefinitionKey: record.taskDefinitionKey,
                          dateCreated      : record.dateCreated,
                          status           : record.status]
        }
        respond records
    }

    def show(String id) {
        respond archiveService.get(id)
    }

    @Transactional
    def save(Archive archive) {
        if (archive == null) {
            render status: NOT_FOUND
            return
        }
        if (archive.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond archive.errors
            return
        }

        try {
            archiveService.save(archive)
        } catch (ValidationException e) {
            respond archive.errors
            return
        }

        respond archive, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(Archive archive) {
        if (archive == null) {
            render status: NOT_FOUND
            return
        }
        if (archive.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond archive.errors
            return
        }

        try {
            archiveService.save(archive)
        } catch (ValidationException e) {
            respond archive.errors
            return
        }

        respond archive, [status: OK, view:"show"]
    }

    def getArchiveRecords() {
        def archives = []
        def query = "SELECT * FROM archive WHERE input_variables LIKE '%${params.id}%'"
        def query2 = "SELECT staff_id,program_id,reporting_end_date,reporting_start_date,organization from work_plan where id = '${params.id}';"
        def result = AppHolder.withMisSql { rows(query.toString()) }
        def result2 = AppHolder.withMisSql { rows(query2.toString()) }
        def id = params.id
        def period = ''
        def assignee = ''
        def taskCase = ''

        def referral = Referral.findById(id)
        if (id != null && referral != null) {
            assignee = referral.assignee
            taskCase = referral.organizationReferredTo
        }

        def activityReport = ActivityReport.findById(id)
        if (id != null && activityReport != null) {
            assignee = activityReport.assignee
            taskCase = activityReport.milestone
        }

        def feedback = Feedback.findById(id)
        if (id != null && feedback != null) {
            assignee = feedback.assignee
            taskCase = feedback.typeOfFeedback
        }

        if (result.size() > 0) {
            result.each {
                def slurper = new JsonSlurper()
                def variables = slurper.parseText(it.input_variables)

                variables['data'].each {
                    if (it.key == 'Period') period = it.value
                }

                def staffId = '', programId = '', endDate = '', startDate = '', organization = ''
                if(it.process_def_key == 'PROGRESS_REPORTING'){
                    result2.each {r ->
                        staffId = r.staff_id
                        programId = r.program_id
                        endDate = r.reporting_end_date
                        startDate = r.reporting_start_date
                        organization = r.organization
                    }
                }

//
                archives << [
                        id: it.id,
                        taskId : it.task_id,
                        processName : it.process_def_key,
                        taskName: it.task_name,
                        inputVariables : it.input_variables,
                        startDate : it.task_start_time,
                        endDate : it.date_created,
                        processInstanceId: it.process_instance_id,
                        staffId: User.findById(staffId)?.names,
                        programId: Program.findById(programId)?.title,
                        workPlanEndDate: endDate,
                        workPlanStartDate: startDate,
                        organization: organization,
                        reportingPeriod: period,
                        assignee: User.findByEmail(assignee)?.names,
                        case: taskCase,
                        referralId: params.id,
                ]
            }
        }
        respond archives
    }

   def getArchiveRecord(){

       def task = Archive.get(params.id)

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

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        archiveService.delete(id)

        render status: NO_CONTENT
    }
}
