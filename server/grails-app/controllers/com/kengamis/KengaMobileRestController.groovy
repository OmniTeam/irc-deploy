package com.kengamis

import com.kengamis.query.QueryHelper
import filterreport.Filter
import filterreport.SqlFilterReport
import grails.rest.*
import grails.converters.*
import org.apache.commons.lang.StringEscapeUtils
import org.springframework.util.Assert
import sun.misc.BASE64Decoder

class KengaMobileRestController {
    static namespace = 'rest'
    static responseFormats = ['json', 'xml']

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
        render entityViews
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
            def sqlFilter = new SqlFilterReport(definedFilters: tableAttr, sql: it)
            sqlFilter.tableNames = tableNames
            sqlFilter.filters = []
            def fellowUsers = user.findFellowUsers()
            if (!fellowUsers.isEmpty() && !preLoadEntity.ignoreUserContext) {
                sqlFilter.filters << new Filter('openxdata_user_name', user.findFellowUsers().collect { it.username })
            }
            if (filters) {
                def filtersFromClient = addFilters(filters)
                sqlFilter.filters.addAll(filtersFromClient)
            }
            return sqlFilter.getFilterData(Util.escapeSql(nextfilter))
        }
        def data = [field: nextfilter, value: '', filterNumber: tableAttr.size(), tableName: preLoadEntity.tableName, dataList: results.collect {
            [value: it]
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
        return [name: ent.name, tableName: ent.tableName, displayField: displayFlds.join(","), keyField: keyField?.name ?: 'id', otherFields: otherFlds]
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
        def decodedPair = new String(new BASE64Decoder().decodeBuffer(encodedPair))
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
        log.info("Size of Filters:${keys.size()} ;size of attributes:${tableAttrs.size()}")
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
                    StringEscapeUtils.escapeSql(it)
                })
            } else {
                filters << new Filter(it.field,StringEscapeUtils.escapeSql(it))
            }
        }
        return filters
    }
}
