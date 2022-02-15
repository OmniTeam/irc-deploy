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
        get "/$controller/get_entity_record(.$format)?"(action:"getEntityRecord")
        get "/$controller/view_data(.$format)?"(action:"viewData")
        get "/$controller/get_task_record(.$format)?"(action:"getTaskRecord")

        '/odxRest/getEntityData'(controller: 'kengaMobileRest', namespace: 'rest', action: 'getEntityData')
        '/odxRest/getServerDbVersion'(controller: 'kengaMobileRest', namespace: 'rest', action: 'getServerDbVersion')
        '/odxRest/getPreloadEntities'(controller: 'kengaMobileRest', namespace: 'rest', action: 'getPreloadEntities')
        '/odxRest/getFilters'(controller: 'kengaMobileRest', namespace: 'rest', action: 'getFilters')
        '/odxRest/getFilteredEntityData'(controller: 'kengaMobileRest', namespace: 'rest', action: 'getFilteredEntityData')
        '/odxRest/getFilteredEntityDataMap'(controller: 'kengaMobileRest', namespace: 'rest', action: 'getFilteredEntityDataMap')

        "/"(controller: 'application', action:'index')
        "500"(view: '/error')
        "404"(view: '/notFound')
    }
}
