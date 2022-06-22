package com.kengamis

import com.kengamis.tasks.StartCamundaInstancesJob
import grails.gorm.transactions.ReadOnly
import grails.gorm.transactions.Transactional
import grails.validation.ValidationException
import groovy.json.JsonSlurper

import static org.springframework.http.HttpStatus.*

@ReadOnly
class TempController {

    TempService tempService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond tempService.list(params), model: [tempCount: tempService.count()]
    }

    def show(String id) {
        respond tempService.get(id)
    }

    @Transactional
    def save(Temp temp) {
        println temp.errors
        if (temp == null) {
            render status: NOT_FOUND
            return
        }
        if (temp.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond temp.errors
            return
        }

        try {
            tempService.save(temp)
        } catch (ValidationException e) {
            respond temp.errors
            return
        }

        respond temp, [status: CREATED, view: "show"]
    }

    @Transactional
    def update(Temp temp) {
        println temp.errors
        if (temp == null) {
            render status: NOT_FOUND
            return
        }
        if (temp.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond temp.errors
            return
        }

        try {
            tempService.save(temp)
        } catch (ValidationException e) {
            respond temp.errors
            return
        }

        respond temp, [status: OK, view: "show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        tempService.delete(id)

        render status: NO_CONTENT
    }

    def getTempRecordByValue(String value) {
        def query = "SELECT * FROM `temp` WHERE json_value LIKE '%${value}%'"
        def results = AppHolder.withMisSql { rows(query as String) }
        respond results
    }

    static generator = { String alphabet, int n ->
        new Random().with {
            (1..n).collect { alphabet[nextInt(alphabet.length())] }.join()
        }
    }

    @Transactional
    def startLongTermGrantJob(String grantId) {
        def message = ["Failed"]
        GrantLetterOfInterest grant = GrantLetterOfInterest.findById(grantId)
        if (grant) {
            createUser(grant)
            boolean started = StartCamundaInstancesJob.startProcessInstance([
                    GrantId          : grantId,
                    ApplicationId    : "",
                    Applicant        : "brunojay001@gmail.com",
                    ProgramTeam      : "brunojay001@gmail.com",
                    ExecutiveDirector: "brunojay001@gmail.com"
            ], "LONG_TERM_GRANT")

            if (started) {
                println "=========Started long term grant instance ========="
                grant.status = "started-longterm"
                grant.save(flush: true, failOnError: true)
                message = ["Started grant process instance"]
            }
        }
        respond message
    }

    @Transactional
    def createUser(GrantLetterOfInterest g) {
        def slurper = new JsonSlurper()
        def orgInfo = slurper.parseText(g.organisation)
        def email = orgInfo['email'] as String
        def names = orgInfo['names'] as String
        def username = generateCode("AP", generator(('0'..'9').join(), 4)) as String
        def password = generator((('A'..'Z') + ('0'..'9')).join(), 9) as String

        def user = new User(email: email, names: names, username: username, password: password)
        user.save(flush: true, failOnError: true)

        Role applicant = Role.findByAuthority("ROLE_APPLICANT")
        def role = new UserRole(user: user, role: applicant)
        role.save(flush: true, failOnError: true)

        println "New User created => username ${username}, password: ${password}"
    }

    def generateCode(def prefix, def increment_value) {
        def actualIncrementValue = addingLeadingZerosToIncrement(increment_value)
        def code = prefix.toString() + '/' + actualIncrementValue.toString()
        return code
    }

    def addingLeadingZerosToIncrement(def increment_value) {
        def stringLength = 6
        def incrementValueLen = increment_value.toString().size()
        def expectedLen = stringLength.toInteger() - incrementValueLen.toInteger()
        for (def i = 0; i <= expectedLen - 1; i++) {
            increment_value = "0" + increment_value
        }
        return increment_value
    }

}
