package com.kengamis

import grails.gorm.transactions.Transactional
import grails.validation.ValidationException
import org.grails.datastore.gorm.GormEntity

import static org.springframework.http.HttpStatus.CREATED
import static org.springframework.http.HttpStatus.NOT_FOUND
import static org.springframework.http.HttpStatus.OK

class GrantShortTermController {

    GrantLetterOfInterest grantLetterOfInterest
    GrantLetterOfInterestReview grantLetterOfInterestReview
    GrantPlanningLearning grantPlanningLearning
    GrantPlanningLearningReview grantPlanningLearningReview
    GrantPlanningLearningApprove grantPlanningLearningApprove
    GrantProvideLearningGrant grantProvideLearningGrant

    static final LETTER_OF_INTEREST = 'letterOfInterest'
    static final REVIEW_LETTER_OF_INTEREST = 'reviewLetterOfInterest'
    static final PLANNING_LEARNING = 'planningLearning'
    static final PLANNING_LEARNING_REVIEW = 'planningLearningReview'
    static final PLANNING_LEARNING_APPROVE = 'planningLearningApprove'
    static final PROVIDE_LEARNING_GRANT = 'provideLearningGrant'

    static responseFormats = ['json', 'xml']

    def show(String form) {
        switch (form) {
            case LETTER_OF_INTEREST:
                grantLetterOfInterest()
                break
            case REVIEW_LETTER_OF_INTEREST:
                grantLetterOfInterestReview()
                break
            case PLANNING_LEARNING:
                grantPlanningLearning()
                break
            case PLANNING_LEARNING_REVIEW:
                grantPlanningLearningReview()
                break
            case PLANNING_LEARNING_APPROVE:
                grantPlanningLearningApprove()
                break
            case PROVIDE_LEARNING_GRANT:
                grantProvideLearningGrant()
                break
            default:
                respond 'Cannot find form'
                break
        }
    }

    @Transactional
    def update(formData) {
        println request.getParameterMap()
        println formData

        if (formData == null) {
            render status: NOT_FOUND
            return
        }

        switch (form) {
            case LETTER_OF_INTEREST:
                GrantLetterOfInterest values = formData as GrantLetterOfInterest
                if (values.hasErrors()) {
                    transactionStatus.setRollbackOnly()
                    respond values.errors
                }
                try {
                    grantLetterOfInterest.save(values)
                } catch (ValidationException e) {
                    respond values.errors
                }

                respond values, [status: CREATED, view: "show"]
                break
            case REVIEW_LETTER_OF_INTEREST:
                GrantLetterOfInterestReview values = formData as GrantLetterOfInterestReview
                if (values.hasErrors()) {
                    transactionStatus.setRollbackOnly()
                    respond values.errors
                }
                try {
                    grantLetterOfInterestReview.save(values)
                } catch (ValidationException e) {
                    respond values.errors
                }

                respond values, [status: CREATED, view: "show"]
                break
            case PLANNING_LEARNING:
                GrantPlanningLearning values = formData as GrantPlanningLearning
                if (values.hasErrors()) {
                    transactionStatus.setRollbackOnly()
                    respond values.errors
                }
                try {
                    grantPlanningLearning.save(values)
                } catch (ValidationException e) {
                    respond values.errors
                }

                respond values, [status: CREATED, view: "show"]
                break
            case PLANNING_LEARNING_REVIEW:
                GrantPlanningLearningReview values = formData as GrantPlanningLearningReview
                if (values.hasErrors()) {
                    transactionStatus.setRollbackOnly()
                    respond values.errors
                }
                try {
                    grantPlanningLearningReview.save(values)
                } catch (ValidationException e) {
                    respond values.errors
                }

                respond values, [status: CREATED, view: "show"]
                break
            case PLANNING_LEARNING_APPROVE:
                GrantPlanningLearningApprove values = formData as GrantPlanningLearningApprove
                if (values.hasErrors()) {
                    transactionStatus.setRollbackOnly()
                    respond values.errors
                }
                try {
                    grantPlanningLearningApprove.save(values)
                } catch (ValidationException e) {
                    respond values.errors
                }

                respond values, [status: CREATED, view: "show"]
                break
            case PROVIDE_LEARNING_GRANT:
                GrantProvideLearningGrant values = formData as GrantProvideLearningGrant
                if (values.hasErrors()) {
                    transactionStatus.setRollbackOnly()
                    respond values.errors
                }
                try {
                    grantProvideLearningGrant.save(values)
                } catch (ValidationException e) {
                    respond values.errors
                }

                respond values, [status: CREATED, view: "show"]
                break
            default:
                respond 'Cannot find form'
                break
        }
    }

    def grantLetterOfInterest() {
        def list = grantLetterOfInterest.all
        respond list
    }

    def grantLetterOfInterestReview() {
        def list = grantLetterOfInterestReview.all
        respond list
    }

    def grantPlanningLearning() {
        def list = grantPlanningLearning.all
        respond list
    }

    def grantPlanningLearningApprove() {
        def list = grantPlanningLearningApprove.all
        respond list
    }

    def grantPlanningLearningReview() {
        def list = grantPlanningLearningReview.all
        respond list
    }

    def grantProvideLearningGrant() {
        def list = grantProvideLearningGrant.all
        respond list
    }
}
