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
class EntityViewFiltersController {

    EntityViewFiltersService entityViewFiltersService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        def entityViewFilters = EntityViewFilters.findAll().collect { entityViewFilter ->
            def entityView = entityViewFilter.entityView.name
            [id: entityViewFilter.id, name: entityViewFilter.name, description: entityViewFilter.description,
             filterQuery: entityViewFilter.filterQuery, entityView: entityView]
        }
        respond entityViewFilters
    }

    def defaultFilterQuery() {
        def entityViewId = params.id as String
        def entityView = EntityView.get(entityViewId)
        def query = """
                SELECT ${entityView.viewFields.collect { it.fieldType=='Key Field'? (it.name + ' as keyField') : it.name }.join(",")} FROM ${entityView.tableName}
                """.toString()
        def res = ["viewQuery" : query]
        respond res
    }

    def show(String id) {
        def entityViewFilter = entityViewFiltersService.get(id)
        def entityView = entityViewFilter.entityView.name
        def entityViewFilterReturned = [id: entityViewFilter.id, name: entityViewFilter.name,
                                        description: entityViewFilter.description,
                                        filterQuery: entityViewFilter.filterQuery, entityView: entityView]
        respond entityViewFilterReturned
    }

    def filterFiltersByEntityView() {
        def entityViewId = params.id as String
        def entityView = EntityView.get(entityViewId)
        def entityViewFilters = EntityViewFilters.findAllByEntityView(entityView).collect { entityViewFilter ->
            [id: entityViewFilter.id, name: entityViewFilter.name, description: entityViewFilter.description,
             filterQuery: entityViewFilter.filterQuery, entityView: entityView.name]
        }
        respond entityViewFilters
    }

    @Transactional
    def save(EntityViewFilters entityViewFilters) {
        if (entityViewFilters == null) {
            render status: NOT_FOUND
            return
        }
        if (entityViewFilters.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond entityViewFilters.errors
            return
        }

        try {
            entityViewFiltersService.save(entityViewFilters)
        } catch (ValidationException e) {
            respond entityViewFilters.errors
            return
        }

        respond entityViewFilters, [status: CREATED, view: "show"]
    }

    @Transactional
    def update(EntityViewFilters entityViewFilters) {
        if (entityViewFilters == null) {
            render status: NOT_FOUND
            return
        }
        if (entityViewFilters.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond entityViewFilters.errors
            return
        }

        try {
            entityViewFiltersService.save(entityViewFilters)
        } catch (ValidationException e) {
            respond entityViewFilters.errors
            return
        }

        respond entityViewFilters, [status: OK, view: "show"]
    }

    @Transactional
    def delete(String id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        entityViewFiltersService.delete(id)

        render status: NO_CONTENT
    }
}
