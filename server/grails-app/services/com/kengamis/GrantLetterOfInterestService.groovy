package com.kengamis

import grails.gorm.services.Service

@Service(GrantLetterOfInterest)
interface GrantLetterOfInterestService {

    GrantLetterOfInterest get(Serializable id)

    List<GrantLetterOfInterest> list(Map args)

    Long count()

    void delete(Serializable id)

    GrantLetterOfInterest save(GrantLetterOfInterest grantLetterOfInterest)

}