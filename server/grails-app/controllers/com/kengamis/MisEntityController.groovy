package com.kengamis

import com.kengamis.exporter.EntityDataExporter
import com.kengamis.query.EntityQueryHelper
import com.kengamis.query.security.Permission
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
    def kengaGroupsService


    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 100, 100)
        def misEntity = MisEntity.findAll().collect { entity ->
            def entityViews = entity.entityViews.collect { [id: it.id, name: it.name]}
            [id: entity.id, name: entity.name, tableName: entity.tableName, prefix: entity.prefix, dateCreated: entity.dateCreated, entityViews: entityViews]
        }
        respond misEntity
    }

    def show(String id) {
        def misEntity = MisEntity.get(id)
        def entityFields = misEntity.entityFields
        def misEntityReturned = [id: misEntity.id, name: misEntity.name, tableName: misEntity.tableName, prefix: misEntity.prefix, enableTagging: misEntity.enableTagging, entityFields: entityFields]
        respond misEntityReturned
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
            createEntityPrefixTable(misEntity)
            if (misEntity.enableTagging) {
                createEntityTagTable(misEntity)
            }
        } catch (ValidationException e) {
            respond misEntity.errors
            return
        }

        respond misEntity, [status: CREATED, view: "show"]
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

        respond misEntity, [status: OK, view: "show"]
    }

    @Transactional
    def delete(String id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }
        def misEntity = MisEntity.get(id)
        def entityTable = misEntity.tableName
        def prefixTable = misEntity.prefixIncrementTable
        def taggingTable = misEntity.entityTagTable

        def entityViews = misEntity.entityViews
        entityViews.each {
            def entityViewTable = it.tableName
            def deleteTableQuery = " DROP VIEW IF EXISTS ${entityViewTable}".toString()
            def results = AppHolder.withMisSqlNonTx { execute(deleteTableQuery) }
            if (!results) {
                log.info("Views successfully deleted")
            }
        }

        def tables = [entityTable?:null, prefixTable?:null, taggingTable?:null].findAll { it != null }.join(", ")
        def deleteTablesQuery = """ DROP TABLE ${tables}""".toString()
        def results = AppHolder.withMisSqlNonTx { execute(deleteTablesQuery) }
        if (!results) {
            log.info("Tables successfully deleted")
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

    def createEntityPrefixTable(MisEntity misEntity) {
        try {
            def query = "CREATE TABLE IF NOT EXISTS ${escapeField misEntity.prefixIncrementTable}( id varchar(255) primary key, mis_entity_id varchar(255), record_id varchar(255), prefix varchar(255), increment_value int not null, code varchar(255), date_created datetime"
            query = query + ")"
            log.trace(query)
            def result = AppHolder.withMisSql { execute(query.toString()) }
            if (!result) {
                log.info("Table ${misEntity.prefixIncrementTable} successfully created")
            }
        }
        catch (Exception ex) {
            ex.printStackTrace()
        }
    }

    def createEntityTagTable(MisEntity misEntity) {
        try {
            def query = "CREATE TABLE IF NOT EXISTS ${escapeField misEntity.entityTagTable}( id varchar(255) primary key, mis_entity_id varchar(255), record_id varchar(255), tag_type_id varchar(255), tag_id varchar(255), date_created datetime"
            query = query + ")"
            log.trace(query)
            def result = AppHolder.withMisSql { execute(query.toString()) }
            if (!result) {
                log.info("Entity Tag Table ${misEntity.entityTagTable} successfully created")
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
            entityData = [
                    headerList : q.headers,
                    resultList: q.data,
                    resultListCount: q.count,
                    entity: q.misEntity,
                    tagTypeList: q.tagTypes,
                    enableTagging: q.misEntity.enableTagging
            ]
        }
        catch (Exception e) {
            flash.error = "Data Might Not Be Available For This entity."
            log.error("Error fetching data", e)
            entityData = [headerList : [], resultList: [], resultListCount: 0, entity: MisEntity.findById(params.id),
                          tagTypeList: []]
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

            // Use the prefix and entity to generate the unique code
            def prefix = misEntity.prefix
            def nextIncrementValue = getNextIncrementValueFromPrefixTable(misEntity)
            def code = generateCode(prefix, nextIncrementValue)

            // Split submitted data into columns and values
            postRequest.each { key, value ->
                columns << key
                values << "'${value}'"
            }

            // Add code and its value as a data to be inserted in the entity table
            columns << '_code'
            values << "'${code}'"

            //Insert into prefix Table
            def queryInsertPrefixIncrement = "INSERT IGNORE INTO ${escapeField misEntity.prefixIncrementTable} (id, mis_entity_id, record_id, prefix, increment_value, code, date_created) values ('${UUID.randomUUID() as String}', '${misEntity.id}', '${id}', '${prefix}', '${nextIncrementValue}', '${code}',  '${dateCreated}')"
            log.trace(queryInsertPrefixIncrement)
            def resultIncrement = AppHolder.withMisSql { execute(queryInsertPrefixIncrement.toString()) }
            if (!resultIncrement) {
                log.info("Table ${misEntity.prefixIncrementTable} successfully inserted a record")
            }

            // Insert into Entity Table
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

    @Transactional
    def updateEntityRecord() {
        def message = ["Entity Record Updated"]
        try {
            def misEntity = MisEntity.get(params.entityId)
            def recordId = params.id as String
            def postRequest = request.JSON
            def updateQuery = "UPDATE ${escapeField misEntity.tableName} set "
            def setConditions = []
            if (postRequest) {
                postRequest.each { key, value ->
                    setConditions << "${key}='${value}'"
                }
            }
            updateQuery += setConditions.join(", ") + " where id='${recordId}'"
            // Update into Entity Table
            log.trace(updateQuery)
            def result = AppHolder.withMisSql { execute(updateQuery.toString()) }
            if (!result) {
                log.trace("Table ${misEntity.tableName} successfully updated a record")
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

    def generateCode(def prefix, def increment_value) {
        def actualIncrementValue = addingLeadingZerosToIncrement(increment_value)
        def code = prefix.toString() + '/' + actualIncrementValue.toString()
        return code
    }

    def getNextIncrementValueFromPrefixTable(MisEntity misEntity) {
        def query = "select max(increment_value) as max_value from ${escapeField misEntity.prefixIncrementTable}"
        def result = AppHolder.withMisSql { rows(query.toString()) }
        if (!result.first()['max_value']) {
            return 1
        } else {
            return result.first()['max_value'] + 1
        }
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

    @Transactional
    def deleteEntityRecord() {
        def recordId  = params.id as String
        def entityId = params.entityId as String
        def misEntity = MisEntity.findById(entityId)

        def deleteTagRecord = "delete from ${escapeField misEntity.entityTagTable} where record_id='${recordId}'"
        def result = AppHolder.withMisSql { execute(deleteTagRecord.toString()) }
        if (!result) {
            log.info("Table ${misEntity.entityTagTable} successfully deleted a record")
        }

        def deleteEntityRecord = "delete from ${escapeField misEntity.tableName} where id='${recordId}'"
        def resultQuery = AppHolder.withMisSql { execute(deleteEntityRecord.toString()) }
        if (!resultQuery) {
            log.info("Table ${misEntity.tableName} successfully deleted a record")
        }
        def message = ["Entity Record Deleted"]
        respond message
    }

    def exportEntityData() {
        def entityData = []
        def id = params.id as String
        try {
            def q = new EntityQueryHelper(params, springSecurityService.currentUser as User)
            def dataExporter = new EntityDataExporter(id, params)
            def exportedData = dataExporter.exportToExcel(q.data)
            def fileName = dataExporter.setFileName()
            entityData = [data: exportedData, file: fileName]
        }
        catch (Exception e) {
            flash.error = "Data Might Not Be Available For This entity."
            log.error("Error fetching data", e)
            entityData = [data: [], file: MisEntity.findById(id).name]
        }
        respond entityData
    }

}
