package com.kengamis

import grails.validation.ValidationException

import java.sql.Timestamp
import java.text.SimpleDateFormat

import static com.kengamis.Util.escapeField
import static org.springframework.http.HttpStatus.CREATED
import static org.springframework.http.HttpStatus.NOT_FOUND
import static org.springframework.http.HttpStatus.NO_CONTENT
import static org.springframework.http.HttpStatus.OK
import static org.springframework.http.HttpStatus.UNPROCESSABLE_ENTITY

import grails.gorm.transactions.ReadOnly
import grails.gorm.transactions.Transactional

@ReadOnly
class TagController {

    TagService tagService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index() {
        def tags = []
        tagService.list(params).each { tag ->
            def newTagObject = [:]
            def tagTypeId = tag.tagType.id
            def tagType = TagType.findById(tagTypeId)
            newTagObject['id'] = tag.id
            newTagObject['name'] = tag.name
            newTagObject['tagType'] = tagTypeId
            newTagObject['dateCreated'] = tag.dateCreated
            newTagObject['lastUpdated'] = tag.lastUpdated
            newTagObject['tagTypeName'] = tagType.name
            tags << newTagObject
        }
        respond tags
    }

    def show(Long id) {
        respond tagService.get(id)
    }

    @Transactional
    def save(Tag tag) {
        if (tag == null) {
            render status: NOT_FOUND
            return
        }
        if (tag.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond tag.errors
            return
        }

        try {
            tagService.save(tag)
        } catch (ValidationException e) {
            respond tag.errors
            return
        }

        respond tag, [status: CREATED, view: "show"]
    }

    @Transactional
    def update(Tag tag) {
        if (tag == null) {
            render status: NOT_FOUND
            return
        }
        if (tag.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond tag.errors
            return
        }

        try {
            tagService.save(tag)
        } catch (ValidationException e) {
            respond tag.errors
            return
        }

        respond tag, [status: OK, view: "show"]
    }

    @Transactional
    def delete(String id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        tagService.delete(id)

        render status: NO_CONTENT
    }

    def getAllTagsByTagType() {
        def id = params.id as String
        def tagType = TagType.get(id)
        def tags = Tag.findAllByTagType(tagType)
        respond tags
    }

    @Transactional
    def tagEntityRecord() {
        def message = ["Entity record tagged successfully"]
        def misEntityId = params.id as String
        def records = request.JSON
        records.each { record ->
            def recordId = record['record_id'] as String
            def tagTypeId = record['tag_type_id'] as String
            def tagId = record['tag_id'] as String
            def simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
            def dateCreated = Timestamp.valueOf(simpleDateFormat.format(new Date()))
            def id = UUID.randomUUID() as String
            def misEntity = MisEntity.get(misEntityId)

            //Insert into Tag Table
            def checkIfTagExists = "select * from ${escapeField misEntity.entityTagTable} where tag_id = '${tagId}' and record_id = '${recordId}'".toString()
            def checks = AppHolder.withMisSqlNonTx { rows(checkIfTagExists) }
            if (checks.size() == 0) {
                def queryInsertTag = "INSERT IGNORE INTO ${escapeField misEntity.entityTagTable} (id, mis_entity_id, record_id, tag_type_id, tag_id, date_created) values ('${id}', '${misEntityId}', '${recordId}', '${tagTypeId}', '${tagId}', '${dateCreated}')"
                log.info(queryInsertTag)
                def result = AppHolder.withMisSql { execute(queryInsertTag.toString()) }
                if (!result) {
                    log.info("Entity Tag Table ${misEntity.entityTagTable} successfully inserted a record")
                }
            }

            def recordTags = getRecordTags(misEntity, recordId)

            def updateQuery = "update ${escapeField misEntity.tableName} set _tag = '${recordTags}' where id = '${recordId}'".toString()
            log.info(updateQuery)
            def resultUpdate = AppHolder.withMisSql { execute(updateQuery.toString()) }
            if (!resultUpdate) {
                log.info("Table ${misEntity.tableName} successfully updated a record")
            }
        }
        respond message
    }

    def getRecordTags(MisEntity misEntity, def recordId) {
        def tagNames = []
        def queryTagIds = "select tag_id from ${escapeField misEntity.entityTagTable} where record_id = '${recordId}'".toString()
        log.trace(queryTagIds)
        def resultTagIds = AppHolder.withMisSql { rows(queryTagIds.toString()) }
        if (resultTagIds.size() > 0) {
            resultTagIds.each {
                def tag = Tag.findById(it['tag_id'].toString())
                tagNames << tag.name
            }
            return tagNames.join(", ")
        }
        return ''
    }

    @Transactional
    def removeTagEntityRecord() {
        def misEntityId = params.id as String
        def records = request.JSON
        records.each { record ->
            def recordId = record['record_id'] as String
            def tagId = record['tag_id'] as String
            def misEntity = MisEntity.get(misEntityId)

            def removeQuery = "delete from ${escapeField misEntity.entityTagTable} where tag_id = '${tagId}' and record_id = '${recordId}'".toString()
            log.trace(removeQuery)
            def resultDelete = AppHolder.withMisSql { execute(removeQuery.toString()) }
            if (!resultDelete) {
                log.info("Table ${misEntity.tableName} successfully removed a record")
            }

            def recordTags = getRecordTags(misEntity, recordId)

            def updateQuery = "update ${escapeField misEntity.tableName} set _tag = '${recordTags}' where id = '${recordId}'".toString()
            log.trace(updateQuery)
            def resultUpdate = AppHolder.withMisSql { execute(updateQuery.toString()) }
            if (!resultUpdate) {
                log.info("Table ${misEntity.tableName} successfully updated a record")
            }
        }
        def message = ["Entity tag Record remove successfully"]
        respond message
    }
}
