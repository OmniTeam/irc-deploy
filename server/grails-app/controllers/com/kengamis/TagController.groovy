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
class TagController {

    TagService tagService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
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
}
