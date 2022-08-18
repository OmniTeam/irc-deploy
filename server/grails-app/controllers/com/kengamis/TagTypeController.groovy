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
class TagTypeController {

    TagTypeService tagTypeService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index() {
        def tagTypes = []
        tagTypeService.list(params).each { tagType ->
            def newTagTypeObject = [:]
            def misEntityId = tagType.misEntity.id
            def misEntity = MisEntity.findById(misEntityId)
            newTagTypeObject['id'] = tagType.id
            newTagTypeObject['name'] = tagType.name
            newTagTypeObject['misEntity'] = misEntityId
            newTagTypeObject['dateCreated'] = tagType.dateCreated
            newTagTypeObject['lastUpdated'] = tagType.lastUpdated
            newTagTypeObject['misEntityName'] = misEntity.name
            newTagTypeObject['misEntityId'] = misEntity.id
            tagTypes << newTagTypeObject
        }
        respond tagTypes
    }

    def show(String id) {
        def tagType = tagTypeService.get(id)
        def newTagTypeObject = [:]
        def misEntityId = tagType.misEntity.id
        def misEntity = MisEntity.findById(misEntityId)
        newTagTypeObject['id'] = tagType.id
        newTagTypeObject['name'] = tagType.name
        newTagTypeObject['misEntity'] = misEntityId
        newTagTypeObject['dateCreated'] = tagType.dateCreated
        newTagTypeObject['lastUpdated'] = tagType.lastUpdated
        newTagTypeObject['misEntityName'] = misEntity.name
        newTagTypeObject['misEntityId'] = misEntity.id
        respond newTagTypeObject
    }

    @Transactional
    def save(TagType tagType) {
        if (tagType == null) {
            render status: NOT_FOUND
            return
        }
        if (tagType.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond tagType.errors
            return
        }

        try {
            tagTypeService.save(tagType)
        } catch (ValidationException e) {
            respond tagType.errors
            return
        }

        respond tagType, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(TagType tagType) {
        if (tagType == null) {
            render status: NOT_FOUND
            return
        }
        if (tagType.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond tagType.errors
            return
        }

        try {
            tagTypeService.save(tagType)
        } catch (ValidationException e) {
            respond tagType.errors
            return
        }

        respond tagType, [status: OK, view:"show"]
    }

    @Transactional
    def delete(String id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        tagTypeService.delete(id)

        render status: NO_CONTENT
    }
}
