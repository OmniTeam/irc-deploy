package com.kengamis

class GrantShortTermController {

    GrantLetterOfInterest grantLetterOfInterest
    GrantLetterOfInterestReview grantLetterOfInterestReview
    GrantPlanningLearning grantPlanningLearning
    GrantPlanningLearningApprove grantPlanningLearningApprove
    GrantPlanningLearningReview grantPlanningLearningReview
    GrantProvideLearningGrant grantProvideLearningGrant

    static responseFormats = ['json', 'xml']

    def grantLetterOfInterest() {
        def list = grantLetterOfInterest.all
        respond list
    }

    def grantLetterOfInterestReview() {
        def list = grantLetterOfInterestReview.findAll()
        respond list
    }

    def grantPlanningLearning() {
        def list = grantPlanningLearning.findAll()
        respond list
    }

    def grantPlanningLearningApprove() {
        def list = grantPlanningLearningApprove.findAll()
        respond list
    }

    def grantPlanningLearningReview() {
        def list = grantPlanningLearningReview.findAll()
        respond list
    }

    def grantProvideLearningGrant() {
        def list = grantProvideLearningGrant.findAll()
        respond list
    }
}
