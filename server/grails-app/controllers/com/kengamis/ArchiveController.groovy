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
            def partnerSetupId = '', startDate = '', partnerId = '', programId = '', endDate = '', groupId = '', period = '', grantId = '',organization=''

            variables['data'].each {
                if (it.key == 'PartnerSetupId') partnerSetupId = it.value
                if (it.key == 'Period') period = it.value
                if (it.key == 'StartDate') startDate = it.value
                if (it.key == 'PartnerId') partnerId = it.value
                if (it.key == 'GrantId') grantId = it.value
                if (it.key == 'ProgramId') programId = it.value
                if (it.key == 'EndDate') endDate = it.value
                if (it.key == 'GroupId') groupId = it.value
                if (it.key == 'Organization') organization = it.value
            }

            def taskPartner = ProgramPartner.findById(partnerId)
            def taskProgram = Program.findById(programId)
            def taskGrant = GrantLetterOfInterest.findById(grantId)

            if (taskPartner == null) taskPartner = [cluster: '']
            if (taskProgram == null) taskProgram = [title: '']

            User currentUser = AppHolder.currentUser()
            def userRoles = UserRole.findAllByUser(currentUser).collect { it.role.authority }.join(",")
            def query = "SELECT USER.id AS user_id, user_partner.program_partner_id as partner_id, program_partner.program_id FROM user INNER JOIN user_partner ON user_partner.user_id = USER.id INNER JOIN program_partner ON program_partner.id = user_partner.program_partner_id WHERE user.id = '${currentUser.id}' "

            def currentUserGroup = KengaUserGroup.findAllByUser(currentUser).collect { it.kengaGroup.name }.join(",")
            boolean c2 = currentUserGroup.contains(taskProgram.title)

            boolean c3 = userRoles.contains("ROLE_SUPER_ADMIN")

            if (c2 || c3) {
                records << [id               : record.id,
                            taskName         : record.taskName,
                            partnerSetupId   : partnerSetupId,
                            startDate        : startDate?:taskGrant?.dateCreated,
                            partnerId        : partnerId,
                            partnerName      : taskPartner.cluster,
                            programId        : programId,
                            grantId          : grantId,
                            case             : organization?:taskPartner.name,
                            programName      : taskProgram.title,
                            endDate          : endDate?:taskGrant?.lastUpdated,
                            groupId          : groupId,
                            reportingPeriod  : period,
                            outputVariables  : record.outputVariables,
                            processInstanceId: record.processInstanceId,
                            processDefKey    : record.processDefKey,
                            taskDefinitionKey: record.taskDefinitionKey,
                            dateCreated      : record.dateCreated,
                            status           : record.status]
            }
        }
        respond records
    }

    def show(String id) {
        respond archiveService.get(id)
    }

    def getTaskRecord() {
        def task = Archive.get(params.id)

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

        respond archive, [status: CREATED, view: "show"]
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

        respond archive, [status: OK, view: "show"]
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
