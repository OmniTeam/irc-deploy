package com.kengamis

import grails.validation.ValidationException

import static fuzzycsv.FuzzyCSVTable.tbl
import static fuzzycsv.FuzzyCSVTable.toCSV
import static org.springframework.http.HttpStatus.CREATED
import static org.springframework.http.HttpStatus.NOT_FOUND
import static org.springframework.http.HttpStatus.NO_CONTENT
import static org.springframework.http.HttpStatus.OK
import static org.springframework.http.HttpStatus.UNPROCESSABLE_ENTITY

import grails.gorm.transactions.ReadOnly
import grails.gorm.transactions.Transactional

@ReadOnly
class ProjectMilestoneController {

    ProjectMilestoneService projectMilestoneService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        def projectMilestones = []
        projectMilestoneService.list(params).each { projectMilestone ->
            def newProjectMilestoneObject = [:]
            def categoryId = projectMilestone.programCategory.id
            def category = ProgramCategory.findById(categoryId)
            def form = ""
            if (projectMilestone.program != null) {
                def program = Program.findById(category.program.id)
                form = program.title
            } else form = projectMilestone.form
            newProjectMilestoneObject['id'] = projectMilestone.id
            newProjectMilestoneObject['name'] = projectMilestone.name
            newProjectMilestoneObject['description'] = projectMilestone.description
            newProjectMilestoneObject['reportingQuery'] = projectMilestone.reportingQuery
            newProjectMilestoneObject['dashboardQuery'] = projectMilestone.dashboardQuery
            newProjectMilestoneObject['categoryId'] = categoryId
            newProjectMilestoneObject['dateCreated'] = projectMilestone.dateCreated
            newProjectMilestoneObject['lastUpdated'] = projectMilestone.lastUpdated
            newProjectMilestoneObject['category'] = category.name
            newProjectMilestoneObject['program'] = form
            projectMilestones << newProjectMilestoneObject
        }
        respond projectMilestones
    }

    def show(String id) {
        def projectMilestone = projectMilestoneService.get(id)
        def newProjectMilestoneObject = [:]
        def categoryId = projectMilestone.programCategory.id
        def category = ProgramCategory.findById(categoryId)
        def form = ""
        def programId = ""
        if (projectMilestone.program != null) {
            def program = Program.findById(category.program.id)
            form = program.title
            programId = program.id
        } else form = projectMilestone.form
        newProjectMilestoneObject['id'] = projectMilestone.id
        newProjectMilestoneObject['name'] = projectMilestone.name
        newProjectMilestoneObject['description'] = projectMilestone.description
        newProjectMilestoneObject['reportingQuery'] = projectMilestone.reportingQuery
        newProjectMilestoneObject['dashboardQuery'] = projectMilestone.dashboardQuery
        newProjectMilestoneObject['categoryId'] = categoryId
        newProjectMilestoneObject['dateCreated'] = projectMilestone.dateCreated
        newProjectMilestoneObject['lastUpdated'] = projectMilestone.lastUpdated
        newProjectMilestoneObject['category'] = category.name
        newProjectMilestoneObject['program'] = form
        newProjectMilestoneObject['programId'] = programId
        respond newProjectMilestoneObject
    }

    @Transactional
    def save(ProjectMilestone projectMilestone) {
        if (projectMilestone == null) {
            render status: NOT_FOUND
            return
        }
        if (projectMilestone.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond projectMilestone.errors
            return
        }

        try {
            projectMilestoneService.save(projectMilestone)
        } catch (ValidationException e) {
            respond projectMilestone.errors
            return
        }

        respond projectMilestone, [status: CREATED, view: "show"]
    }

    @Transactional
    def update(ProjectMilestone projectMilestone) {
        if (projectMilestone == null) {
            render status: NOT_FOUND
            return
        }
        if (projectMilestone.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond projectMilestone.errors
            return
        }

        try {
            projectMilestoneService.save(projectMilestone)
        } catch (ValidationException e) {
            respond projectMilestone.errors
            return
        }

        respond projectMilestone, [status: OK, view: "show"]
    }

    @Transactional
    def delete(String id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        projectMilestoneService.delete(id)

        render status: NO_CONTENT
    }

    def getMilestonesByProgram() {
        def programId = params.program as String
        def programMilestones = ProjectMilestone.findAllByProgram(programId);
        def data = [milestones: programMilestones]
        respond data
    }

    def runQuery() {
        def milestoneData
        def milestoneQuery = params.query as String
        try {
            def query = "${milestoneQuery}".toString()
            def data = AppHolder.withMisSql {
                toCSV(it, query)
            }.csv

            def dataMapList = tbl(data).toMapList()
            def headers = dataMapList.get(0).keySet()
            milestoneData = [dataList: dataMapList, headerList: headers]
        }
        catch (Exception e) {
            log.error("Error fetching data", e)
            milestoneData = [dataList: [], headerList: []]
        }
        respond milestoneData
    }

    def getMilestoneDataForReports() {
        def milestone = []
        def projectMilestone = projectMilestoneService.get(params.id)
        def programPartner = ProgramPartner.get(params.partnerId)
        def reportingQuery
        if (projectMilestone != null) reportingQuery = projectMilestone.reportingQuery

        if (reportingQuery != null) {
            try {
                def queryC = "${reportingQuery}".toString()
                def clause = (queryC.contains("where") || queryC.contains("WHERE")) ? " and" : " where"

                def column = " activity_date "
                if (queryC.contains("monitoring_and_learning")) column = " activity_date "
                if (queryC.contains("good_school_environment")) column = " activity_start "
                if (queryC.contains("economic_empowerment_activity")) column = " activity_start "
                if (queryC.contains("parenting_skills_and_spousal_relationship")) column = " activity_start_date "
                if (queryC.contains("safe_environment_for_adolescents")) column = " activity_start "
                if (queryC.contains("safe_environment_for_adolescents") && queryC.contains("case_mgt")) column = " date "

                def queryQ = queryC + clause + column + "between '${params.startDate}' and '${params.endDate}'"

                def cumulative = [total: 0]
                if (queryC != null) {
                    queryC = queryC + clause + " cluster = '${programPartner.cluster}'"
                    println "cummulative ==>"
                    println queryC
                    cumulative = AppHolder.withMisSql { rows(queryC) }.first()
                }

                def quarter = [total: 0]
                if (queryQ != null){
                    queryQ = queryQ + " and cluster = '${programPartner.cluster}'"
                    println "quarterly ==>"
                    println queryQ
                    quarter = AppHolder.withMisSql { rows(queryQ as String) }.first()
                }

                milestone = [id: projectMilestone.id, cumulativeAchievement: cumulative.total, quaterAchievement: quarter.total]

            } catch (Exception e) {
                log.error("Error fetching data", e)
            }
        }

        respond milestone
    }

}
