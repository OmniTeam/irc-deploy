package com.kengamis

import grails.gorm.services.Service

@Service(CalendarTriggerDates)
interface CalendarTriggerDatesService {

    CalendarTriggerDates get(Serializable id)

    List<CalendarTriggerDates> list(Map args)

    Long count()

    void delete(Serializable id)

    CalendarTriggerDates save(CalendarTriggerDates calenderTriggerDates)

}