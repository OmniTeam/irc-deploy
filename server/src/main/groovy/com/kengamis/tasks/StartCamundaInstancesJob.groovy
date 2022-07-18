package com.kengamis.tasks

import com.kengamis.AppHolder
import com.kengamis.CalendarTriggerDates
import com.kengamis.GrantLetterOfInterest
import com.kengamis.PartnerSetup
import com.kengamis.Program
import com.kengamis.ProgramPartner
import com.kengamis.Temp
import grails.util.Holders
import groovy.json.JsonOutput
import groovy.json.JsonSlurper
import groovyx.net.http.ContentType
import groovyx.net.http.HTTPBuilder
import groovyx.net.http.Method

class StartCamundaInstancesJob extends Script {
    static String camundaApiUrl = Holders.grailsApplication.config.camundaUrl as String
    static String CRVPF_REPORTING = "CRVPF_REPORTING"
    static String GRANT_PROCESS = "GRANT_PROCESS"

    static queryUserRoles = "SELECT user.username, user.email,role.authority as role, kenga_group.name as group_program " +
            "FROM user INNER JOIN user_role ON user.id = user_role.user_id " +
            "INNER JOIN role ON user_role.role_id = role.id " +
            "INNER JOIN kenga_user_group ON user.id = kenga_user_group.user_id " +
            "INNER JOIN kenga_group ON kenga_user_group.kenga_group_id = kenga_group.id " +
            "WHERE user.email IS NOT NULL"

    @Override
    Object run() {
        reportingJob()
        planningAndLearningGrantJob()
        return null
    }

    static reportingJob() {
        PartnerSetup.findAllByStartCycle("true").each { setup ->
            boolean startInstance = true

            def query = "SELECT calendar_trigger_dates.id, " +
                    "calendar_trigger_dates.start_date, " +
                    "calendar_trigger_dates.end_date, " +
                    "calendar_trigger_dates.period " +
                    "FROM partner_setup " +
                    "INNER JOIN calendar_trigger_dates ON partner_setup.id = calendar_trigger_dates.partner_setup_id " +
                    "WHERE partner_setup.id='${setup.id}' " +
                    "AND calendar_trigger_dates.end_date <= CURDATE() " +
                    "AND calendar_trigger_dates.started = 1 " +
                    "AND calendar_trigger_dates.completed = 0;"

            def startedAndNotCompleted = AppHolder.withMisSql { rows(query.toString()) }
            if (startedAndNotCompleted.size() != 0) startInstance = false

            if (startInstance) {
                def query2 = "SELECT calendar_trigger_dates.id, " +
                        "calendar_trigger_dates.start_date, " +
                        "calendar_trigger_dates.end_date, " +
                        "calendar_trigger_dates.period " +
                        "FROM partner_setup " +
                        "INNER JOIN calendar_trigger_dates ON partner_setup.id = calendar_trigger_dates.partner_setup_id " +
                        "WHERE partner_setup.id='${setup.id}' " +
                        "AND calendar_trigger_dates.end_date <= CURDATE() " +
                        "AND calendar_trigger_dates.started = 0 " +
                        "ORDER BY calendar_trigger_dates.period LIMIT 1;"
                def r = AppHolder.withMisSql { rows(query2.toString()) }

                try {
                    if (r.size() > 0) {
                        def result = r.first()
                        def partner = ProgramPartner.findById(setup.partnerId)

                        def edEmail = []
                        def mealEmail = []
                        def financeEmail = []
                        def programTeamEmail = []

                        def roles = AppHolder.withMisSql { rows(queryUserRoles.toString()) }
                        roles.each {
                            if (it['role'] == "ROLE_ED") edEmail << it['email']
                            if (it['role'] == "ROLE_FINANCE") financeEmail << it['email']
                            if (it['role'] == "ROLE_MEAL") mealEmail << it['email']
                            if (it['role'] == "ROLE_PROGRAM_OFFICER" && it['group_program'] == partner.program.title) programTeamEmail << it['email']
                        }

                        boolean started = startProcessInstance([
                                PartnerSetupId   : setup.id,
                                PartnerId        : setup.partnerId,
                                PartnerName      : partner.cluster,
                                Assignee         : partner.emailContactPerson,
                                Meal             : mealEmail[0],
                                Finance          : financeEmail[0],
                                ProgramTeam      : programTeamEmail[0],
                                ExecutiveDirector: edEmail[0],
                                ProgramId        : setup.programId,
                                StartDate        : result['start_date'],
                                EndDate          : result['end_date'],
                                Period           : result['period'],
                                GroupId          : "${getGroupIds(setup.partnerId)}"
                        ], CRVPF_REPORTING)


                        if (started) {
                            print "================ started reporting process instance ================"
                            def calendar = CalendarTriggerDates.get(result['id'] as String)
                            calendar.started = true
                            calendar.save()
                        }
                    }
                } catch (e) {
                    e.printStackTrace()
                }
            }
        }
    }

    static planningAndLearningGrantJob() {
        GrantLetterOfInterest.findAllByStatus("not_started").each { grant ->

            def r = AppHolder.withMisSql { rows(queryUserRoles.toString()) }

            try {
                if (r.size() > 0) {

                    def slurper = new JsonSlurper()
                    def orgInfo = slurper.parseText(grant.organisation)
                    def applicantEmail = orgInfo['email']
                    def organization = orgInfo['name']
                    def cluster = orgInfo['nameCluster']

                    def edEmail = []
                    def financeEmail = []
                    def programTeamEmail = []
                    def program = Program.get(grant.program)

                    r.each {
                        if (it['role'] == "ROLE_ED") edEmail << it['email']
                        if (it['role'] == "ROLE_FINANCE") financeEmail << it['email']
                        if (it['role'] == "ROLE_PROGRAM_OFFICER" && it['group_program'] == program.title) programTeamEmail << it['email']
                    }

                    boolean started = startProcessInstance([
                            GrantId          : grant.id,
                            ProgramId        : grant.program,
                            Cluster          : cluster,
                            Applicant        : applicantEmail,
                            ProgramTeam      : programTeamEmail[0],
                            Finance          : financeEmail[0],
                            ExecutiveDirector: edEmail[0],
                            Organization     : organization
                    ], GRANT_PROCESS)


                    if (started) {
                        print "================ started grant process instance ================"
                        grant.status = 'started'
                        grant.save()
                    }
                }
            } catch (e) {
                e.printStackTrace()
            }
        }
    }

    static boolean startProcessInstance(Map processVariables, String processKey) {
        def http = new HTTPBuilder(camundaApiUrl + "/start-instance")
        boolean toReturn = false
        http.request(Method.POST, ContentType.JSON) { req ->
            body = formatProcessVariables(processVariables, processKey)
            headers.Accept = 'application/json'
            requestContentType = ContentType.JSON
            response.success = { resp, json ->
                println("Camunda :: startProcessInstance() True [ " + json.text + " ]")
                toReturn = true
            }
            response.failure = { resp ->
                println("Camunda :: startProcessInstance() False [ " + resp.status + " ]")
            }
        }
        return toReturn
    }

    static def formatProcessVariables(Map processVariables, String processKey) {
        def toReturn = [processDefKey: processKey, variables: processVariables]
        return JsonOutput.toJson(toReturn)
    }

    static def getGroupIds(def partnerId) {
        def query = "SELECT " +
                "USER.id AS userId, " +
                "USER.username, " +
                "user_partner.program_partner_id, " +
                "program_partner.`cluster` AS partner, " +
                "program_partner.program_id, " +
                "rr.authority " +
                "FROM " +
                "`user` " +
                "INNER JOIN user_partner ON user_partner.user_id = USER.id " +
                "INNER JOIN program_partner ON program_partner.id = user_partner.program_partner_id  " +
                "INNER JOIN (SELECT user_role.user_id, role.authority FROM role INNER JOIN user_role ON user_role.role_id = role.id) as rr ON rr.user_id = user.id " +
                "WHERE " +
                "program_partner.id = '${partnerId}' " +
                "AND rr.authority IN ('ROLE_MEAL','ROLE_PROGRAM_OFFICER','ROLE_ED','ROLE_FINANCE')";

        def result = AppHolder.withMisSql { rows(query.toString()) }.collect { it['authority'] }.join(',')
        return result
    }
}
