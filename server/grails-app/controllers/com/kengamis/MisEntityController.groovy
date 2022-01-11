package com.kengamis

import com.kengamis.query.EntityQueryHelper
import grails.converters.JSON
import grails.validation.ValidationException
import groovy.json.JsonSlurper
import groovy.util.logging.Log4j

import java.sql.Timestamp
import java.text.SimpleDateFormat

import static com.kengamis.Util.escapeField
import static org.springframework.http.HttpStatus.CREATED
import static org.springframework.http.HttpStatus.NOT_FOUND
import static org.springframework.http.HttpStatus.NO_CONTENT
import static org.springframework.http.HttpStatus.OK

import grails.gorm.transactions.ReadOnly
import grails.gorm.transactions.Transactional

@Log4j
@ReadOnly
class MisEntityController {

    MisEntityService misEntityService
    def springSecurityService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 100, 100)
        def misEntity = MisEntity.findAll().collect {entity ->
            def entityViews = entity.entityViews.collect { [id: it.id, name: it.name] }
            [id: entity.id, name: entity.name, tableName: entity.tableName, dateCreated: entity.dateCreated, entityViews: entityViews]
        }
        respond misEntity
    }

    def show(Long id) {
        respond misEntityService.get(id)
    }

    def getEntityRecord() {
        def misEntity = MisEntity.get(params.id)
        respond misEntity
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
            def query = "CREATE TABLE IF NOT EXISTS ${escapeField misEntity.tableName}( id varchar(255) primary key,submitterName varchar(255), date_created datetime, unique_id varchar(255)"
            def defaultFields = ['id', 'submitterName', 'date_created', 'unique_id']
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

    def getEntityData() {
        def entityData = []
        try {
            def q = new EntityQueryHelper(params, springSecurityService.currentUser as User)
            entityData = [headerList: q.headers, resultList: q.data, resultListCount: q.count, entity: q.misEntity]
        }
        catch (Exception e) {
            flash.error = "Data Might Not Be Available For This entity."
            log.error("Error fetching data", e)
            entityData = [headerList: [], resultList: [], resultListCount: 0, entity: MisEntity.findById(params.id)]
        }
        respond entityData
    }

    @Transactional
    def insertEntityRecord() {
        def message = ["Entity Record Inserted"]
        try {
            def misEntity = MisEntity.get(params.id)
            def postRequest = request.JSON
            def id = UUID.randomUUID() as String
            def submitterName = springSecurityService.currentUser as User
            def simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
            def dateCreated = Timestamp.valueOf(simpleDateFormat.format(new Date()))
            def uniqueId = "uuid:" + UUID.randomUUID() as String
            def columns = []
            def values = []
            postRequest.each { key, value ->
                columns << key
                values << "'${value}'"
            }
            def query = "INSERT IGNORE INTO ${escapeField misEntity.tableName} (id, submitterName, date_created, unique_id, ${columns.join(", ")}) values ('${id}', '${submitterName.username}', '${dateCreated}', '${uniqueId}', ${values.join(", ")})"
            log.trace(query)
            def result = AppHolder.withMisSql { execute(query.toString()) }
            if (!result) {
                log.info("Table ${misEntity.tableName} successfully inserted a record")
            }
        }
        catch (Exception ex) {
            ex.printStackTrace()
        }
        respond message
    }

    def getEntityFields() {
        def entityFields = []
        try {
            def misEntity = MisEntity.findById(params.id)
            def getAllEntityFields = EntityFields.findAllByMisEntity(misEntity, [sort: "orderOfDisplay", order: "asc"])
            def forms = Form.findAllByEnabled(true, [sort: "displayName", order: "asc"])
            entityFields = [entity: misEntity, entityFields: getAllEntityFields, forms: forms]
        }
        catch (Exception e) {
            flash.error = "Data Might Not Be Available For This entity."
            log.error("Error fetching data", e)
            entityFields = [entity: [], entityFields: [], forms: []]
        }
        respond entityFields
    }
}
