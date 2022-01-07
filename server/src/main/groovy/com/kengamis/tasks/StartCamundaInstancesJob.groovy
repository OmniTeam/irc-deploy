package com.kengamis.tasks

import groovy.json.JsonOutput
import groovyx.net.http.ContentType
import groovyx.net.http.HTTPBuilder
import groovyx.net.http.Method

import java.text.SimpleDateFormat

class StartCamundaInstancesJob extends Script {
    static String camundaApiUrl = "http://localhost:8080/mis/rest"
    static String CIIF_MANAGEMENT_KEY = "CRVPF_REPORTING"
    static def dateFormat = new SimpleDateFormat("yyyy-MM-dd")

    @Override
    Object run() {
        boolean started = startProcessInstance([
                Start_date : "12-20-2021",
                Report_id : UUID.randomUUID().toString(),
                Report_Name :  "Test Report",
                Report_Assigne : "Makwasis Cris"
        ], CIIF_MANAGEMENT_KEY)
        if (started) println(".................Started instances......")
            else println("............failed to start instances")

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
