package com.kengamis

import grails.validation.ValidationException
import groovy.util.logging.Log4j

import static com.kengamis.Util.escapeField
import static org.springframework.http.HttpStatus.CREATED
import static org.springframework.http.HttpStatus.NOT_FOUND
import static org.springframework.http.HttpStatus.NO_CONTENT
import static org.springframework.http.HttpStatus.OK
import static org.springframework.http.HttpStatus.UNPROCESSABLE_ENTITY

import grails.gorm.transactions.ReadOnly
import grails.gorm.transactions.Transactional

@Log4j
@ReadOnly
class MisEntityController {

    MisEntityService misEntityService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 100, 100)
        respond misEntityService.list(params), model:[misEntityCount: misEntityService.count()]
    }

    def show(Long id) {
        respond misEntityService.get(id)
    }

    @Transactional
    def save(MisEntity misEntity) {
        if (misEntity == null) {
            render status: NOT_FOUND
            return
        }
        if (misEntity.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond misEntity.errors
            return
        }

        try {
            misEntityService.save(misEntity)
            createEntityTable(misEntity)
        } catch (ValidationException e) {
            respond misEntity.errors
            return
        }

        respond misEntity, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(MisEntity misEntity) {
        if (misEntity == null) {
            render status: NOT_FOUND
            return
        }
        if (misEntity.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond misEntity.errors
            return
        }

        try {
            misEntityService.save(misEntity)
        } catch (ValidationException e) {
            respond misEntity.errors
            return
        }

        respond misEntity, [status: OK, view:"show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        misEntityService.delete(id)

        render status: NO_CONTENT
    }

    def createEntityTable(MisEntity misEntity) {
        try {
            def query = "CREATE TABLE IF NOT EXISTS ${escapeField misEntity.tableName}( uid varchar(255) primary key,submitterName varchar(255), date_created datetime, unique_id varchar(255)"
            def defaultFields = ['uid', 'submitterName', 'date_created', 'unique_id']
            misEntity.entityFields.eachWithIndex { entry, idx ->
                if (!defaultFields.contains(entry.fieldName)) {
                    query += ",${escapeField entry.fieldName} ${entry.sqlDataType}"
                }
            }
            query = query + ")"
            log.trace(query)
            def result = AppHolder.withMisSql { execute(query.toString()) }
            if (!result) {
                log.info("Table ${misEntity.tableName} successfully created")
            }
        }
        catch (Exception ex) {
            ex.printStackTrace()
        }
    }
}
