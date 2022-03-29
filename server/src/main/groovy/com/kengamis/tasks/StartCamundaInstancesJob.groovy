package com.kengamis.tasks

import com.kengamis.TaskList
import com.kengamis.CalendarTriggerDates
import groovy.json.JsonOutput
import groovy.json.JsonSlurper
import groovyx.net.http.ContentType
import groovyx.net.http.HTTPBuilder
import groovyx.net.http.Method
import com.kengamis.PartnerSetup

import java.text.SimpleDateFormat

class StartCamundaInstancesJob extends Script {
    static String camundaApiUrl = "http://206.189.209.21:8090/mis/rest"
    //static String camundaApiUrl = "http://localhost:8181/mis/rest"
    static String CIIF_MANAGEMENT_KEY = "CRVPF_REPORTING"
    static def dateFormat = new SimpleDateFormat("yyyy-MM-dd")

    @Override
    Object run() {
        PartnerSetup.findAllByStartCycle("true").each { setup ->
            def allTasksForPartnerCompleted = allTasksCompleted(setup.id)
            def calendar = CalendarTriggerDates.findAllByPartnerSetupId(setup.id)

            calendar.each {

                def sdf = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss")
                def endDate = sdf.parse(it.endDate)
                def currentDate = new Date()

                if (allTasksForPartnerCompleted && endDate <= currentDate) {
                    boolean started = startProcessInstance([
                            PartnerSetupId: setup.id,
                            PartnerId     : setup.partnerId,
                            ProgramId     : setup.programId,
                            StartDate     : it.startDate,
                            EndDate       : it.endDate,
                            Period        : it.period,
                            GroupId       : ""
                    ], CIIF_MANAGEMENT_KEY)

                    if(started) print "================ started the damn instance ================"
                }
            }

        }
        return null
    }

    static boolean allTasksCompleted(setupId) {
        def list = TaskList.where {status != 'completed'}.findAllByInputVariablesIlike('%' + setupId + '%')
        print "list $list"
        return list.size() == 0
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
