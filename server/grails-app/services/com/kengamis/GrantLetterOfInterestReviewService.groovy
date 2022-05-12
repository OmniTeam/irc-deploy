package com.kengamis

import grails.gorm.services.Service

@Service(GrantLetterOfInterestReview)
interface GrantLetterOfInterestReviewService {

    GrantLetterOfInterestReview get(Serializable id)

    List<GrantLetterOfInterestReview> list(Map args)

    Long count()

    void delete(Serializable id)

    GrantLetterOfInterestReview save(GrantLetterOfInterestReview grantLetterOfInterestReview)

}