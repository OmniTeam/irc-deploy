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
class ReportFormFilesController {

    ReportFormFilesService reportFormFilesService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond reportFormFilesService.list(params), model:[reportFormFilesCount: reportFormFilesService.count()]
    }

    def show(Long id) {
        respond reportFormFilesService.get(id)
    }

    @Transactional
    def save(ReportFormFiles reportFormFiles) {
        //print "Report Errors: ${reportFormFiles.errors}"
        if (reportFormFiles == null) {
            render status: NOT_FOUND
            return
        }
        if (reportFormFiles.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond reportFormFiles.errors
            return
        }

        try {
            reportFormFilesService.save(reportFormFiles)
        } catch (ValidationException e) {
            respond reportFormFiles.errors
            return
        }

        respond reportFormFiles, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(ReportFormFiles reportFormFiles) {
        if (reportFormFiles == null) {
            render status: NOT_FOUND
            return
        }
        if (reportFormFiles.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond reportFormFiles.errors
            return
        }

        try {
            reportFormFilesService.save(reportFormFiles)
        } catch (ValidationException e) {
            respond reportFormFiles.errors
            return
        }

        respond reportFormFiles, [status: OK, view:"show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        reportFormFilesService.delete(id)

        render status: NO_CONTENT
    }

    def getFileByTaskAndName() {
        def file = [fileRecord: ReportFormFiles.findByTaskIdAndName(params.taskId, params.name)]
        respond file
    }

    def getFilesForTask() {
        def data = [files: ReportFormFiles.findAllByTaskId(params.taskId)]
        respond data
    }
}
