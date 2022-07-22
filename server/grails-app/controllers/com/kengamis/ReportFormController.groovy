package com.kengamis


import grails.gorm.transactions.ReadOnly
import grails.gorm.transactions.Transactional
import grails.validation.ValidationException
import groovy.json.JsonSlurper
import groovy.time.TimeCategory

import java.text.SimpleDateFormat

import static org.springframework.http.HttpStatus.*

@ReadOnly
class ReportFormController {

    ReportFormService reportFormService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
//        params.max = Math.min(max ?: 10, 100)
        def slurper = new JsonSlurper()
        def list = []
        reportFormService.list(params).collect {
            def task = TaskList.get(it.taskId)
            if (task != null) {
                def inputVariables = task.inputVariables
                def variables = slurper.parseText(inputVariables)
                def programId = '', periodType = ''
                variables['data'].each {
                    if (it.key == 'ProgramId') programId = it.value
                    if (it.key == 'Period') periodType = it.value
                }
                def program = Program.get(programId)

                list << [
                        id               : it.id,
                        taskId           : it.taskId,
                        taskDefinitionKey: it.taskDefinitionKey,
                        process          : task.processDefKey,
                        program          : program.title,
                        periodType       : periodType,
                        dateCreated      : it.dateCreated,
                        lastUpdated      : it.lastUpdated,
                        status           : it.status
                ]
            } else {
                list << [
                        id               : it.id,
                        taskDefinitionKey: it.taskDefinitionKey,
                        program          : '',
                        periodType       : '',
                        dateCreated      : it.dateCreated,
                        lastUpdated      : it.lastUpdated,
                        status           : it.status
                ]
            }
        }

        respond list, model: [reportFormCount: reportFormService.count()]
    }

    def show(Long id) {
        respond reportFormService.get(id)
    }

    @Transactional
    def save(ReportForm reportForm) {
        print "Report Errors: ${reportForm.errors}"
        if (reportForm == null) {
            render status: NOT_FOUND
            return
        }
        if (reportForm.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond reportForm.errors
            return
        }

        try {
            reportFormService.save(reportForm)
        } catch (ValidationException e) {
            respond reportForm.errors
            return
        }

        respond reportForm, [status: CREATED, view: "show"]
    }

    @Transactional
    def update(ReportForm reportForm) {
        print "Report Errors: ${reportForm.errors}"
        if (reportForm == null) {
            render status: NOT_FOUND
            return
        }
        if (reportForm.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond reportForm.errors
            return
        }

        try {
            reportFormService.save(reportForm)
        } catch (ValidationException e) {
            respond reportForm.errors
            return
        }

        respond reportForm, [status: OK, view: "show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        reportFormService.delete(id)

        render status: NO_CONTENT
    }

    def getReportForTask() {
        def reportData = [report: ReportForm.findByProcessInstanceId(params.processInstanceId)]
        respond reportData
    }

    def getMilestonePerformance() {
        def slurper = new JsonSlurper()
        def milestones = []
        WorkPlan.all.each {
            def values = slurper.parseText(it.setupValues)
            def performanceIndicators = slurper.parseText(values['indicators'] as String)
            def financialBudget = values['budget']

            def expenseToDate = ''
            def approvedBudget = ''

            financialBudget.each { f ->
                if(f['totalSpent'] == "NaN" || f['approvedAmount'] == "NaN") {
                    expenseToDate  = '0'
                    approvedBudget = '0'
                } else {
                    expenseToDate = f['totalSpent']
                    approvedBudget = f['approvedAmount']
                }

            }
            if (performanceIndicators != null) {
                performanceIndicators.each { p ->
                    ProjectMilestone pm = ProjectMilestone.findById(p['milestoneId'] as String)

                    def cumulativeAchievement = 0


                    def query = "SELECT report_values FROM report_form WHERE user_id IN (SELECT staff_id FROM work_plan WHERE setup_values LIKE '%${p['milestoneId']}%')"
                    def result = AppHolder.withMisSql { rows(query.toString()) }

                    if (result != null) {
                        def reportValues = slurper.parseText(result['report_values'] as String)
                        def perfReport = slurper.parseText(reportValues['performanceReport'] as String)
                        perfReport.each { prr ->
                            prr.each {r ->
                                if (r['milestoneId'] == p['milestoneId']) {
                                    cumulativeAchievement = r['cumulative_achievement']
                                }
                            }
                        }

                    }
                    int overAllTarget = (p['overallTarget']!='') ? p['overallTarget'] as int : 0
                    milestones << [
                            milestoneId          : pm?.id,
                            staffId              : it.staffId,
                            milestone            : pm?.name,
                            categoryId           : pm?.programCategoryId,
                            pillar               : pm?.program,
                            overallTarget        : p['overallTarget'],
                            cumulativeAchievement: cumulativeAchievement,
                            startDate            : p['startDate'],
                            endDate              : p['endDate'],
                            organization         : it?.organization,
                            expenseToDate        : expenseToDate,
                            approvedBudget       : approvedBudget,
                            progress             : getRowPerformance(p['startDate'] as String, p['endDate'] as String, overAllTarget, cumulativeAchievement ?: 0),
                            efficiency           : getEfficiency((approvedBudget ?: 0) as int , (expenseToDate ?: 0) as int),
                            achievement          : getEfficiency(overAllTarget,cumulativeAchievement),
                            budgetEfficiency     : getBudgetProgress(overAllTarget, (approvedBudget ?: 0 ) as int, (expenseToDate ?: 0) as int, cumulativeAchievement ?: 0),
                            percentage           : getPercentage(overAllTarget,cumulativeAchievement ?: 0)
                    ]
                }

            }

        }
        respond milestones
    }

    //target vs Time

    static def daysBetween(def startDate, def endDate) {
        use(TimeCategory) {
            def duration = endDate - startDate
            return duration.days as Integer
        }
    }

    def getRowPerformance(String start,String end,int target,int achieved){
        def pattern = "yyyy-MM-dd"
        def startDate = new SimpleDateFormat(pattern).parse(start)
        def endDate = new SimpleDateFormat(pattern).parse(end)
        def today = new Date()

        def duration

        try {
            if (startDate != null && endDate != null) {
                duration = daysBetween(startDate, endDate)
            } else {
                duration = 1
            }

            def daily
            if(Math.round(target/duration) <= 0 ){
                daily = 1
            } else {
                daily = Math.round(target/duration)
            }

            def elapsedTime = daysBetween(startDate, today)

            def expected = daily * elapsedTime

            if(achieved >= expected * 0.5 && achieved <= expected * 0.7){
                return 'Slow Progress'
            } else if (achieved > expected * 0.7){
                return 'Good Progress'
            } else {
                return 'Late'
            }
        } catch (NumberFormatException ex) {
            return 'N/A'
        }

    }

    //get budget progress

    def getBudgetProgress(int  target, int budget , int spent , achieved){
        def  amountPerTarget  = 0
        if(target > 0 ) amountPerTarget = budget / target
        def  actualPerformance = 0
        if(achieved > 0){
            actualPerformance = spent / achieved
        }

        def calculatedPerformance = 0
        if(amountPerTarget > 0) calculatedPerformance = (actualPerformance * 100) / amountPerTarget

        if(calculatedPerformance > 110){
            return 'Over Spent'
        } else if (calculatedPerformance >= 90 && calculatedPerformance <= 110){
            return 'Good Burn Rate'
        } else if(calculatedPerformance > 50 && calculatedPerformance <= 89){
            return 'Low Burn Rate'
        }
    }

    //get Efficiency Report
    def getEfficiency(int budget, int expenses) {
        def efficiency = 0
        if (budget != 0) {
            efficiency = Math.round((expenses / budget) * 100)
        }
        return efficiency
    }

    def getPercentage(target, achieved){
        def percentage

        if(target > 0){
            percentage = (achieved * 100) / target
        } else {
            percentage  =  0
        }
//       = ((achieved * 100) / target)

        if(percentage > 75){
            return 'Acceptable Performance'
        } else if(percentage > 50 && percentage <= 75){
            return 'Average Performance'
        } else {
            return 'Under Performance'
        }

    }

    def getActivityReportRecord() {
        def milestone = params.milestone as String
        def startDate = params.startDate as String
        def endDate = params.endDate as String
        def query = "SELECT id, milestone, cost_associated FROM `activity_report` where milestone = '${milestone}' and start_date >= '${startDate}' AND end_date <= '${endDate}'"
        def list = AppHolder.withMisSql { rows(query.toString()) }
        respond list
    }
}
