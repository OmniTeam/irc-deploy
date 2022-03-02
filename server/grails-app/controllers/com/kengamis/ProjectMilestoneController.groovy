package com.kengamis

import grails.validation.ValidationException
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
        params.max = Math.min(max ?: 10, 100)
        respond projectMilestoneService.list(params), model:[projectMilestoneCount: projectMilestoneService.count()]
    }

    def show(String id) {
        respond projectMilestoneService.get(id)
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

        respond projectMilestone, [status: CREATED, view:"show"]
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

        respond projectMilestone, [status: OK, view:"show"]
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
}
