package com.kengamis

class UrlMappings {

    static mappings = {
        delete "/$controller/$id(.$format)?"(action:"delete")
        get "/$controller(.$format)?"(action:"index")
        get "/$controller/$id(.$format)?"(action:"show")
        post "/$controller(.$format)?"(action:"save")
        put "/$controller/$id(.$format)?"(action:"update")
        patch "/$controller/$id(.$format)?"(action:"patch")
        get "/$controller/central_projects(.$format)?"(action:"create")
        get "/$controller/enabled_forms(.$format)?"(action:"enabledForms")
        get "/$controller/get_point_details(.$format)?"(action:"getPointDetails")
        get "/$controller/get_form_data_record(.$format)?"(action:"getFormDataRecord")
        get "/$controller/get_entity_data(.$format)?"(action:"getEntityData")
        post "/$controller/insert_entity_record(.$format)?"(action:"insertEntityRecord")
        get "/$controller/get_entity_fields(.$format)?"(action:"getEntityFields")
        get "/$controller/get_export_form_data(.$format)?"(action:"getExportFormData")
        get "/$controller/view_data(.$format)?"(action:"viewData")
        get "/$controller/get_task_record(.$format)?"(action:"getTaskRecord")
        get "/$controller/get_partner_setup_record(.$format)?"(action:"getPartnerSetupRecord")
        get "/$controller/get_report_for_task(.$format)?"(action:"getReportForTask")
        get "/$controller/get_file_by_task_and_name(.$format)?"(action:"getFileByTaskAndName")
        get "/$controller/get_files_for_task(.$format)?"(action:"getFilesForTask")
        get "/$controller/get_comments_for_task(.$format)?"(action:"getCommentsForTask")
        get "/$controller/get_recommendations_for_task(.$format)?"(action:"getRecommendationsForTask")
        get "/$controller/get_recommendation(.$format)?"(action:"getRecommendationById")
        get "/$controller/get_comment(.$format)?"(action:"getCommentById")
        get "/$controller/getAllTagsByTagType(.$format)?"(action:"getAllTagsByTagType")
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
        "/deleteOldKengaUserGroups"(controller: 'kengaGroup', action:'deleteOldKengaUserGroups',method: 'DELETE' )
        "/showUser"(controller: 'user', action:'showUserWithAssociatedData',method: 'GET' )
        "/deleteOldRoleAndGroups"(controller: 'user', action:'deleteUserWithAssociatedData',method: 'DELETE' )
        "/"(controller: 'application', action:'index')
        "500"(view: '/error')
        "404"(view: '/notFound')
    }
}
