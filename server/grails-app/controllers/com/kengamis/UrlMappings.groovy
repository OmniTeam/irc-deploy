package com.kengamis

class UrlMappings {

    static mappings = {
        delete "/$controller/$id(.$format)?"(action:"delete")
        get "/$controller(.$format)?"(action:"index")
        get "/$controller/$id(.$format)?"(action:"show")
        post "/$controller(.$format)?"(action:"save")
        put "/$controller/$id(.$format)?"(action:"update")
        patch "/$controller/$id(.$format)?"(action:"patch")
        get "/$controller/getEnabledForms(.$format)?"(action:"getEnabledForms")
        get "/$controller/getPointDetails(.$format)?"(action:"getPointDetails")
        get "/$controller/getFormDataRecord(.$format)?"(action:"getFormDataRecord")
        get "/$controller/getEntityData(.$format)?"(action:"getEntityData")
        post "/$controller/insertEntityRecord(.$format)?"(action:"insertEntityRecord")
        post "/$controller/updateEntityRecord(.$format)?"(action:"updateEntityRecord")
        get "/$controller/getEntityFields(.$format)?"(action:"getEntityFields")
        get "/$controller/exportFormData(.$format)?"(action:"getExportedFormData")
        get "/$controller/viewData(.$format)?"(action:"viewData")
        get "/$controller/getTaskRecord(.$format)?"(action:"getTaskRecord")
        get "/$controller/getPartnerSetupRecord(.$format)?"(action:"getPartnerSetupRecord")
        get "/$controller/getReportForTask(.$format)?"(action:"getReportForTask")
        get "/$controller/getFileByTaskAndName(.$format)?"(action:"getFileByTaskAndName")
        get "/$controller/getFilesForTask(.$format)?"(action:"getFilesForTask")
        get "/$controller/getCommentsForTask(.$format)?"(action:"getCommentsForTask")
        get "/$controller/getRecommendationsForTask(.$format)?"(action:"getRecommendationsForTask")
        get "/$controller/getRecommendationById(.$format)?"(action:"getRecommendationById")
        get "/$controller/getCommentById(.$format)?"(action:"getCommentById")
        get "/$controller/getAllTagsByTagType(.$format)?"(action:"getAllTagsByTagType")
        get "/$controller/getReportingCalendarByPartnerSetupId(.$format)?"(action:"getReportingCalendarByPartnerSetupId")
        get "/$controller/getProgramPartnersWithoutWorkPlan(.$format)?"(action:"getProgramPartnersWithoutWorkPlan")
        get "/$controller/updateReportingCalendarStatus(.$format)?"(action:"updateReportingCalendarStatus")
        get "/$controller/getMilestoneDataForReports(.$format)?"(action:"getMilestoneDataForReports")
        post "/$controller/tagEntityRecord(.$format)?"(action:"tagEntityRecord")
        post "/$controller/removeTagEntityRecord(.$format)?"(action:"removeTagEntityRecord")
        get "/$controller/runNow(.$format)?"(action:"runNow")
        get "/$controller/scheduleTask(.$format)?"(action:"scheduleTask")
        get "/$controller/unScheduleTask(.$format)?"(action:"unScheduleTask")
        get "/$controller/disableTask(.$format)?"(action:"disableTask")
        get "/$controller/getFormDataImage(.$format)?"(action:"getFormDataImage")
        get "/$controller/getHttpMethods(.$format)?"(action:"getHttpMethods")
        get "/$controller/getCategoriesByProgram(.$format)?"(action:"getCategoriesByProgram")
        get "/$controller/getMilestonesByProgram(.$format)?"(action:"getMilestonesByProgram")
        get "/$controller/defaultFilterQuery(.$format)?"(action:"defaultFilterQuery")
        get "/$controller/filterFiltersByEntityView(.$format)?"(action:"filterFiltersByEntityView")
        get "/$controller/deleteEntityRecord(.$format)?"(action:"deleteEntityRecord")
        get "/$controller/getDataViewData(.$format)?"(action:"getDataViewData")
        get "/$controller/dataViewRunNow(.$format)?"(action:"dataViewRunNow")
        get "/$controller/runQuery(.$format)?"(action:"runQuery")
        get "/$controller/syncViewToMetabase(.$format)?"(action:"syncViewToMetabase")
        get "/$controller/getDataCollectors(.$format)?"(action:"getDataCollectors")
        get "/$controller/runFilterQuery(.$format)?"(action:"runFilterQuery")
        get "/$controller/saveUserEntityViewFilter(.$format)?"(action:"saveUserEntityViewFilter")
        get "/$controller/exportEntityData(.$format)?"(action:"exportEntityData")
        get "/$controller/exportZippedFormData(.$format)?"(action:"getExportedZippedFormData")


        group "/odxRest/", {
            'getEntityData'(controller: 'kengaMobileRest', namespace: 'rest', action: 'getEntityData')
            'getServerDbVersion'(controller: 'kengaMobileRest', namespace: 'rest', action: 'getServerDbVersion')
            'getPreloadEntities'(controller: 'kengaMobileRest', namespace: 'rest', action: 'getPreloadEntities')
            'getFilters'(controller: 'kengaMobileRest', namespace: 'rest', action: 'getFilters')
            'getFilteredEntityData'(controller: 'kengaMobileRest', namespace: 'rest', action: 'getFilteredEntityData')
            'getFilteredEntityDataMap'(controller: 'kengaMobileRest', namespace: 'rest', action: 'getFilteredEntityDataMap')
            'getDefaultEntityDataMap'(controller: 'kengaMobileRest', namespace: 'rest', action: 'getDefaultEntityDataMap')

        }

        group "/api/v1/user/", {
            'import-users'(controller: 'user', action: 'uploadUsers', method: 'POST')
        }

        "/api/v1/aclGroupMapping"(controller: 'kengaGroupAclEntry', action:'saveGroupMappings',method: 'POST' )
        "/api/v1/aclGroupMapping-v2"(controller: 'kengaGroupAclEntry', action:'saveGroupMappingsWithParent',method: 'POST' )
        "/"(controller: 'application', action:'index')
        "500"(view: '/error')
        "404"(view: '/notFound')
    }
}
