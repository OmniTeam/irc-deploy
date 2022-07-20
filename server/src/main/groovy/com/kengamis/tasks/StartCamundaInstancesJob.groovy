package com.kengamis.tasks

import com.kengamis.*
import grails.util.Holders
import groovy.json.JsonOutput
import groovyx.net.http.ContentType
import groovyx.net.http.HTTPBuilder
import groovyx.net.http.Method

class StartCamundaInstancesJob extends Script {
    static String camundaApiUrl = Holders.grailsApplication.config.camundaUrl as String
    static String QUARTERLY_REPORTING = "PROGRESS_REPORTING"
    static String IRC_ACTIVITY_REPORT = "ACTIVITY_REPORTING"
    static String IRC_REFERRAL = "IRC_REFERRAL"
    static String IRC_FEEDBACK = "IRC_FEEDBACK"

    @Override
    Object run() {
        ircReportingJob()
        ircActivityReportingJob()
        ircReferralJob()
        ircFeedbackJob()
        return null
    }

    static void ircReportingJob(){
        WorkPlan.findAllByStartCycle("true").each { workPlan ->
            boolean startInstance = true

            def query = "SELECT calendar_trigger_dates.id, " +
                    "calendar_trigger_dates.start_date, " +
                    "calendar_trigger_dates.end_date, " +
                    "calendar_trigger_dates.period " +
                    "FROM work_plan " +
                    "INNER JOIN calendar_trigger_dates ON work_plan.id = calendar_trigger_dates.work_plan_id " +
                    "WHERE work_plan.id='${workPlan.id}' " +
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
                        "FROM work_plan " +
                        "INNER JOIN calendar_trigger_dates ON work_plan.id = calendar_trigger_dates.work_plan_id " +
                        "WHERE work_plan.id='${workPlan.id}' " +
                        "AND calendar_trigger_dates.end_date <= CURDATE() " +
                        "AND calendar_trigger_dates.started = 0 " +
                        "ORDER BY calendar_trigger_dates.period LIMIT 1;"
                def r = AppHolder.withMisSql { rows(query2.toString()) }

                try {
                    if (r.size() > 0) {
                        def result = r.first()
                        User staff = User.findById(workPlan.staffId)
                        boolean started = startProcessInstance([
                                PartnerSetupId: workPlan.id,
                                PartnerId     : workPlan.staffId,
                                ProgramId     : workPlan.programId,
                                StartDate     : result['start_date'],
                                EndDate       : result['end_date'],
                                Period        : result['period'],
                                Assignee      : staff?.email,
                                Supervisor    : "ccathy@omnitech.co.ug",
                                MandE         : "ccathy@omnitech.co.ug"
                        ], QUARTERLY_REPORTING)


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
            def findUser = User.findByEmail(activity.assignee)

            if (startInstance) {
                try {
                        boolean started = startProcessInstance([
                                ActivityId    : activity.id,
                                StartDate     : activity.startDate,
                                Case          : activity.milestone,
                                Assignee      : activity.assignee,
                                Name          : findUser?.names,

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
        Referral.findAllByStatus("Not Actioned").each { referral ->
            boolean startInstance = true
            def findUser = User.findByEmail(referral.assignee)

            if (startInstance) {
                try {

                    boolean started = startProcessInstance([
                            ReferralId    : referral.id,
                            StartDate     : referral.dateOfReferral,
                            Case          : referral.organizationReferredTo,
                            Assignee      : referral.assignee,
                            Name          : findUser?.names,

                    ], IRC_REFERRAL)


                    if (started) {
                        print "================ Yes Here We Go!!! ================"
                        println("IRC PROCESS STARTED")
                        referral.status = "Actioned"
                        referral.save()
                    }

                } catch (e) {
                    e.printStackTrace()
                }
            }
        }
    }

    static void ircFeedbackJob(){
        Feedback.findAllByCurrentStatusOfFeedback("Forwarded For Action").each { feed ->
            boolean startInstance = true
            //find user by email
            def findUser = User.findByEmail(feed.assignee)


            if (startInstance) {
                try {

                    boolean started = startProcessInstance([
                            FeedbackId    : feed.id,
                            StartDate     : feed.dateFeedbackReceived,
                            Case          : feed.typeOfFeedback,
                            Assignee      : feed.assignee,
                            Name          : findUser?.names

                    ], IRC_FEEDBACK)


                    if (started) {
                        print "================ Yes Here We Go!!! ================"
                        println("IRC PROCESS STARTED")
                        feed.currentStatusOfFeedback = "Actioned"
                        feed.status = "Started"
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
