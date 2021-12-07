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

        "/"(controller: 'application', action:'index')
        "500"(view: '/error')
        "404"(view: '/notFound')
    }
}
