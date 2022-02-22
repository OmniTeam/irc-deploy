package com.kengamis

import com.kengamis.query.QueryHelper
import filterreport.Filter
import filterreport.SqlFilterReport
import grails.core.GrailsApplication
import grails.converters.*
import org.apache.commons.lang.StringEscapeUtils
import org.springframework.util.Assert

class KengaMobileRestController {
    static namespace = 'rest'
    static responseFormats = ['json', 'xml']
    GrailsApplication grailsApplication
    def springSecurityService
    def scriptService

    def index() {}

    def getServerDbVersion() {
        log.trace params
        def data = ["dbVersion": 1]
        render data as JSON
    }

    def getPreloadEntities() {
        User user = getUserFromRequest()
        Assert.notNull(user, "Username cannot be null")
        def entityViews = []

        if (user) {
            entityViews = EntityView.findAll().collect { entityView ->
                def viewFields = EntityViewFields.findAllByEntityView(entityView)
                viewToJSON(viewFields, entityView)
            }
        }
        render entityViews as JSON
    }

    def getFilteredEntityData() {
        User user = getUserFromRequest()

        Assert.notNull(user, "Username cannot be null")

        def entityRequest = request.JSON as Map
        def tableName = entityRequest.tableName

        def keyField = entityRequest.keyField
        def displayField = entityRequest.displayField
        def prefillFilterList = entityRequest.prefillFilterList

        def entity = MisEntity.findByTableName(tableName)

        QueryHelper q = new QueryHelper(params, user)

        def results = AppHolder.withMisSql {
            def sqlFilter = new SqlFilterReport(sql: it)
            sqlFilter.tableNames = [tableName]
            sqlFilter.filters = []
            if (prefillFilterList) {
                def filtersFromClient = addFilters(prefillFilterList)
                sqlFilter.filters.addAll(filtersFromClient)
            }
            def displayFieldQuery = generateDisplayFieldQuery(displayField, tableName)
            def tmpBinding = [
                    keyField         : keyField,
                    tableName        : tableName,
                    displayFieldQuery: displayFieldQuery,
                    q                : q,
                    sqlFilter        : sqlFilter
            ]

            def query = ""
            if (entity) {
                query = scriptService.evaluate(entity.query, tmpBinding)
            } else {
                query = scriptService.evaluate(MisEntity.DEFAULT_QUERY, tmpBinding)
            }
            log.info(query)

            def data = rows(query).collect {
                ["keyField": it.keyField, "displayField": it.displayField]
            }
            return data
        }
        render results as JSON
    }

    def getFilteredEntityDataMap() {
        User user = getUserFromRequest()
        Assert.notNull(user, "Username cannot be null")

        def entityRequest = request.JSON as Map
        String tableName = entityRequest.tableName

        def keyField = entityRequest.keyField
        def prefillFilterList = entityRequest.prefillFilterList

        def entity = null
        if(tableName.endsWith('view')){
            entity = EntityView.findByTableName(tableName)
        }else{
            entity = MisEntity.findByTableName(tableName)
        }

        QueryHelper q = new QueryHelper(params, user)

        def results = AppHolder.withMisSql {
            def sqlFilter = new SqlFilterReport(sql: it)
            sqlFilter.tableNames = [tableName]
            sqlFilter.filters = []
            if (prefillFilterList) {
                def filtersFromClient = addFilters(prefillFilterList)
                sqlFilter.filters.addAll(filtersFromClient)
            }
            def otherFields = generateOtherFieldsQuery(entity)

            def tmpBinding = [
                    keyField   : keyField,
                    tableName  : tableName,
                    otherFields: otherFields,
                    q          : q,
                    sqlFilter  : sqlFilter
            ]

            def query = ""
            if(entity && entity instanceof EntityView){
                query = scriptService.evaluate(EntityView.DEFAULT_QUERY,tmpBinding)
            }  else {
                query = scriptService.evaluate(MisEntity.DEFAULT_QUERY, tmpBinding)
            }
            def data = rows(query.toString()).collect {
                def otherFldsMap = [:]
                otherFieldsToList(otherFields).each { fld ->
                    otherFldsMap << ["$fld": it."$fld"]
                }
                ["keyField": it.keyField, "otherFields": otherFldsMap]
            }
            return data
        }
        render results as JSON
    }

    def getFilters() {
        def user = getUserFromRequest()
        Assert.notNull(user, "Username cannot be null")
        def filters = request.JSON as List
        Assert.notNull(filters, "Filters cannot be null")
        def tableAttr
        def tableNames
        def nextfilter
        def preLoadEntity

        preLoadEntity = getFilterEntity(filters)
        tableNames = [preLoadEntity.tableName]
        if(preLoadEntity instanceof EntityView){
            tableAttr = EntityViewFields.findAllByFieldTypeLikeAndEntityView("%${EntityViewFields.TYPE_FILTER_FIELD}%", preLoadEntity, [sort: "filterOrder", order: "asc"]).collect {
                it.name
            }
        }
        nextfilter = getNextFilter(filters.size() == 1 ? [] : filters, tableAttr, true)
        def results = AppHolder.withMisSql {
            try {
                def sqlFilter = new SqlFilterReport(definedFilters: tableAttr, sql: it)
                sqlFilter.tableNames = tableNames
                sqlFilter.filters = []
                if (filters) {
                    def filtersFromClient = addFilters(filters)
                    sqlFilter.filters.addAll(filtersFromClient)
                }
                return sqlFilter.getFilterData(Util.escapeSql(nextfilter))
            }
            catch (Exception e) {
                log.error("Error", e)
                return []
            }
        }
        def data = [field: nextfilter, value: '', filterNumber: tableAttr.size(), tableName: preLoadEntity.tableName, dataList: results.collect {
            [value: OmniUtils.cleanOxdData(it)]
        }]
        render data as JSON
    }

    def getEntityData() {
        def authString = request.getHeader('Authorization')
        if (!authString) {
            redirect("403")
            return
        }
        def user = decodeBasicUser(authString)
        Assert.notNull(user, "Username cannot be null")
        Map queryParams = [noFormSetting: true]
        QueryHelper queryHelper = new QueryHelper(queryParams, user)
        def whereClause = 'WHERE ' + queryHelper.whereClause

        if (user.hasAnyRole(Role.ROLE_SUPER_ADMIN, Role.ROLE_ADMIN)) {
            whereClause = ''
        }

        def tableName = params.tableName
        def keyField = params.keyField
        def displayField = params.displayField
        if (tableName && keyField && displayField) {
            def displayFieldQuery = "CONCAT(${displayField.split(",").join(",',',")}) as displayField"
            def query = """
                    SELECT $keyField as keyField,$displayFieldQuery FROM $tableName $whereClause
                """
            def data = AppHolder.withMisSql { rows(query.toString()) }
            render data as JSON
        }
    }

    def viewToJSON(List<EntityViewFields> viewFields, EntityView ent) {
        def displayFlds = viewFields.findAll { f -> f.fieldType.contains(EntityViewFields.TYPE_DISPLAY_FIELD) }.sort {
            it.orderOfDisplay
        }
        def keyField = viewFields.find { it.fieldType.contains(EntityViewFields.TYPE_KEY_FIELD) }
        def otherFlds = viewFields.findAll { it != keyField && !displayFlds.contains(it) }.collect { it.name }
        return [name: ent.name, tableName: ent.tableName, displayField: displayFlds.join(","), keyField: keyField?.name ?: '', otherFields: otherFlds]
    }


    private User getUserFromRequest() {
        def authString = request.getHeader('Authorization')
        log.info(authString)
        if (!authString) {
            return null
        }
        def user = decodeBasicUser(authString)
        return user
    }

    def decodeBasicUser(def authString) {
        def encodedPair = authString - 'Basic '
        def decodedPair = new String(encodedPair.decodeBase64())
        def credentials = decodedPair.split(':')
        def user = User.findByUsername(credentials[0])

        if (user) {
            return user
        } else {
            return null
        }

    }

    private def getFilterEntity(def filters) {
        Assert.notNull(filters, "Filters cannot be null")
        Assert.notEmpty(filters, "Filters cannot be empty")
        String tableName = filters.get(0).tableName
        Assert.notNull(tableName, "No table found in filters")

        if(tableName.endsWith('view')){
            return EntityView.findByTableName(tableName)
        }else{
            return null
        }
    }

    def getNextFilter(def filters, def tableAttrs, boolean isNewMode) {
        def keys = filters.collect { it.field }
        if (keys.size() == 0) return tableAttrs.get(0)
        if (keys.size() > 0 && (keys.size() <= tableAttrs.size())) {
            if (isNewMode) return tableAttrs.get(keys.size() - 1)
            return tableAttrs.get(keys.size())
        }
        return ''
    }

    private List<Filter> addFilters(List fromClient) {
        def filters = []
        fromClient.each {
            if (!it.value) {
                return
            }
            if (it.value.split(',').size() > 1) {
                filters << new Filter(it.field, it.value.split(',').toList().collect {
                    StringEscapeUtils.escapeSql(OmniUtils.reconstructOxdData(it))
                })
            } else {
                filters << new Filter(it.field, StringEscapeUtils.escapeSql(OmniUtils.reconstructOxdData(it.value)))
            }
        }
        return filters
    }

    String generateDisplayFieldQuery(String displayField, String tableName) {
        return "CONCAT(${displayField.split(",").collect { tableName + "." + it }.join(",',',")}) as displayField".toString()
    }

    String generateOtherFieldsQuery(def entity) {
        def otherFields = []
        if(entity instanceof EntityView){
            otherFields = entity.viewFields.findAll { !it.fieldType.contains(EntityViewFields.TYPE_KEY_FIELD) }
        }
        if (otherFields.isEmpty()) {
            return ""
        } else {
            return ",${otherFields.collect { it.name }.join(",")}"
        }
    }

    def otherFieldsToList(String otherFields) {
        if (otherFields.isEmpty()) return []
        return otherFields.drop(1).split(",")
    }

    def beforeInterceptor = {
        session?.setMaxInactiveInterval(5)
    }
}
