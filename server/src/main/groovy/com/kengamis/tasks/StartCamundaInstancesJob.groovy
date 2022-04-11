package com.kengamis.tasks

import com.kengamis.PartnerSetup
import com.kengamis.TaskList
import groovy.json.JsonOutput
import groovyx.net.http.ContentType
import groovyx.net.http.HTTPBuilder
import groovyx.net.http.Method

import java.text.SimpleDateFormat

class StartCamundaInstancesJob extends Script {
//    static String camundaApiUrl = "http://206.189.209.21:8090/mis/rest"
    static String camundaApiUrl = "http://localhost:8181/mis/rest"
    static String CIIF_MANAGEMENT_KEY = "CRVPF_REPORTING"
    static def dateFormat = new SimpleDateFormat("yyyy-MM-dd")

    @Override
    Object run() {
        def partnerSetup = PartnerSetup.all.each {
            def list = TaskList.findAllByInputVariablesIlike('%' + it.partnerId + '%')
            if (list.size() == 0) {
                boolean started = startProcessInstance([
                        PartnerSetupId: it.id,
                        PartnerId     : it.partnerId,
                        ProgramId     : it.programId,
                        StartDate     : it.reportingStartDate,
                        EndDate       : it.endDate,
                        GroupId       : ""
                ], CIIF_MANAGEMENT_KEY)
            }
        }
        return null
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
