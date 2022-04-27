package com.kengamis.tasks

import com.kengamis.ActivityReport
import com.kengamis.AppHolder
import com.kengamis.CalendarTriggerDates
import com.kengamis.Feedback
import com.kengamis.PartnerSetup
import com.kengamis.Referral
import groovy.json.JsonOutput
import groovyx.net.http.ContentType
import groovyx.net.http.HTTPBuilder
import groovyx.net.http.Method

import java.text.SimpleDateFormat

class StartCamundaInstancesJob extends Script {
//    static String camundaApiUrl = "http://206.189.209.21:8090/mis/rest"
    static String camundaApiUrl = "http://localhost:8181/mis/rest"
    static String CIIF_MANAGEMENT_KEY = "IRC_REPORTING"
    static String IRC_ACTIVITY_REPORT = "ACTIVITY_REPORTING"
    static String IRC_REFERRAL = "IRC_REFERRAL"
    static String IRC_FEEDBACK = "IRC_FEEDBACK"
    static def dateFormat = new SimpleDateFormat("yyyy-MM-dd")

    @Override
    Object run() {
        ircReportingJob()
        ircActivityReportingJob()
        ircReferralJob()
        ircFeedbackJob()
        return null
    }

    static void ircReportingJob(){
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
                        boolean started = startProcessInstance([
                                PartnerSetupId: setup.id,
                                PartnerId     : setup.partnerId,
                                ProgramId     : setup.programId,
                                StartDate     : result['start_date'],
                                EndDate       : result['end_date'],
                                Period        : result['period'],
                                GroupId       : ""
                        ], CIIF_MANAGEMENT_KEY)


                        if (started) {
                            print "================ started the damn instance ================"
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

    static void ircActivityReportingJob(){
        ActivityReport.findAllByStatus("Started").each { activity ->
            boolean startInstance = true

            if (startInstance) {
                try {
                        boolean started = startProcessInstance([
                                ActivityId    : activity.id,
                                StartDate     : activity.startDate,
                                EndDate       : activity.endDate,
                                Assignee      : activity.assignee

                        ], IRC_ACTIVITY_REPORT)
                        if (started) {
                            print "================ Yes Here We Go!!! ================"
                            println("IRC PROCESS STARTED")
                            activity.status = "Running"
                            activity.save()
                        }

                } catch (e) {
                    e.printStackTrace()
                }
            }
        }
    }

    static void ircReferralJob(){
        Referral.findAllByStatus("Pending").each { referral ->
            boolean startInstance = true

            if (startInstance) {
                try {

                    boolean started = startProcessInstance([
                            ReferralId    : referral.id,
                            StartDate     : referral.dateOfReferral,
                            EndDate       : referral.lastUpdated,
                            Assignee      : referral.assignee

                    ], IRC_REFERRAL)


                    if (started) {
                        print "================ Yes Here We Go!!! ================"
                        println("IRC PROCESS STARTED")
                        referral.status = "Running"
                        referral.save()
                    }

                } catch (e) {
                    e.printStackTrace()
                }
            }
        }
    }

    static void ircFeedbackJob(){
        Feedback.findAllByStatus("Pending").each { feed ->
            boolean startInstance = true

            if (startInstance) {
                try {

                    boolean started = startProcessInstance([
                            FeedbackId    : feed.id,
                            StartDate     : feed.dateFeedbackReceived,
                            EndDate       : feed.lastUpdated,
                            Assignee      : feed.assignee

                    ], IRC_FEEDBACK)


                    if (started) {
                        print "================ Yes Here We Go!!! ================"
                        println("IRC PROCESS STARTED")
                        feed.status = "Running"
                        feed.save()
                    }

                } catch (e) {
                    e.printStackTrace()
                }
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
}
