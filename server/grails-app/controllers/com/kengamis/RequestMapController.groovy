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
class RequestMapController {

    RequestMapService requestMapService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond requestMapService.list(params), model:[requestMapCount: requestMapService.count()]
    }

    def show(Long id) {
        respond requestMapService.get(id)
    }

    @Transactional
    def save(RequestMap requestMap) {
        if (requestMap == null) {
            render status: NOT_FOUND
            return
        }
        if (requestMap.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond requestMap.errors
            return
        }

        try {
            requestMapService.save(requestMap)
        } catch (ValidationException e) {
            respond requestMap.errors
            return
        }

        respond requestMap, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(RequestMap requestMap) {
        if (requestMap == null) {
            render status: NOT_FOUND
            return
        }
        if (requestMap.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond requestMap.errors
            return
        }

        try {
            requestMapService.save(requestMap)
        } catch (ValidationException e) {
            respond requestMap.errors
            return
        }

        respond requestMap, [status: OK, view:"show"]
    }

    @Transactional
    def delete(Long id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        requestMapService.delete(id)

        render status: NO_CONTENT
    }
}
