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
            if (record.taskDefinitionKey == "Review_Program_Report" || record.taskDefinitionKey == "Approve_Report") {
                def currentUserGroup = KengaUserGroup.findAllByUser(currentUser).collect { it.kengaGroup.name }.join(",")
                if (userRoles.contains("ROLE_PROGRAM_OFFICER")) c2 = currentUserGroup.contains(taskProgram.title)
            } else if (record.taskDefinitionKey == "Submit_Report" || record.taskDefinitionKey == "Submit_Final_Report") {
                c2 = userPartner.contains(partnerId) && userProgram.contains(programId)
            } else if (record.taskDefinitionKey == "Review_Performance_Report") {
                c2 = userRoles.contains("ROLE_MEAL")
            } else if (record.taskDefinitionKey == "Review_Finance_Report" || record.taskDefinitionKey == "Disburse_Funds") {
                c2 = userRoles.contains("ROLE_FINANCE")
            } else if (record.taskDefinitionKey == "Approve_Fund_Disbursement") {
                c2 = userRoles.contains("ROLE_ED")
            }

            boolean c3 = userRoles.contains("ROLE_SUPER_ADMIN")

            if (c2 || c3) {
                records << [id               : record.id,
                          taskName         : record.taskName,
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

    def show(Long id) {
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
