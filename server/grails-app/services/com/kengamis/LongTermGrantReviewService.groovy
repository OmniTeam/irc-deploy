package com.kengamis

import grails.gorm.services.Service

@Service(LongTermGrantReview)
interface LongTermGrantReviewService {

    LongTermGrantReview get(Serializable id)

    List<LongTermGrantReview> list(Map args)

    Long count()

    void delete(Serializable id)

    LongTermGrantReview save(LongTermGrantReview longTermGrantReview)

}