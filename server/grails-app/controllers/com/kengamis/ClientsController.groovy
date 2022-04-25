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
class ClientsController {

    ClientsService clientsService

    static responseFormats = ['json', 'xml']
    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 1000, 6000)
        respond clientsService.list(params), model:[clientsCount: clientsService.count()]
    }

    def show(String id) {
        respond clientsService.get(id)
    }

    @Transactional
    def save(Clients clients) {
        if (clients == null) {
            render status: NOT_FOUND
            return
        }
        if (clients.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond clients.errors
            return
        }

        try {
            clientsService.save(clients)
        } catch (ValidationException e) {
            respond clients.errors
            return
        }

        respond clients, [status: CREATED, view:"show"]
    }

    @Transactional
    def update(Clients clients) {
        if (clients == null) {
            render status: NOT_FOUND
            return
        }
        if (clients.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond clients.errors
            return
        }

        try {
            clientsService.save(clients)
        } catch (ValidationException e) {
            respond clients.errors
            return
        }

        respond clients, [status: OK, view:"show"]
    }

    @Transactional
    def delete(String id) {
        if (id == null) {
            render status: NOT_FOUND
            return
        }

        clientsService.delete(id)

        render status: NO_CONTENT
    }
}
