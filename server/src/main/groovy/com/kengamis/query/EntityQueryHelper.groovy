package com.kengamis.query

import com.kengamis.EntityFields
import com.kengamis.MisEntity
import com.kengamis.User
import groovy.util.logging.Log4j

import static com.kengamis.AppHolder.withMisSql
import static com.kengamis.AppHolder.withMisSqlNonTx
import static com.kengamis.Util.escapeField
import static com.kengamis.Util.extractId

@Log4j
class EntityQueryHelper {

    Map params
    List<EntityFields> headers
    User currentUser
    String entityTable

    EntityQueryHelper(Map params, User currentUser) {
        init(params, currentUser)
    }

    private void init(Map params, User currentUser) {
        this.params = params
        this.currentUser = currentUser
        def misEntity = getMisEntity()
        headers = EntityFields.findAllByMisEntity(misEntity, [sort: "orderOfDisplay", order: "asc"])
        entityTable = misEntity.tableName

    }

    MisEntity getMisEntity() {
        return MisEntity.findById(getEntityId())
    }

    String getEntityId() {
        return params.id
    }

    int getOffset() {
        def offset = extractId(params, 'offset')
        return offset < 0 ? 0 : offset
    }

    int getMaxRows() {
        def max = extractId(params, 'max')
        return max < 0 ? 50 : max
    }

    long getCount() {
        withMisSql { firstRow(_query({ 'count(*) as count' })).count }
    }

    List<Map> getData() {
        log.trace("Query: Fetching Data: [$query]")
        withMisSqlNonTx { rows("$query  limit $maxRows offset $offset".toString()) }
    }

    String getQuery() {
        def queryFields = queryFields()
        def fields = { queryFields.join(',') }
        def q = _query(fields)
        return q
    }

    List<String> queryFields() {
        def rt = ['`id`', '`submitterName`', '`date_created`', '`unique_id`']
        if (!headers) {
            rt = ['*']
        } else {
            def field1
            rt.addAll headers.collect { field ->
                field1 = escapeField(field.fieldName)
                field1
            }
        }
        return rt.unique()
    }

    private String _query(Closure generateFields) {
        def q = "SELECT ${generateFields()} FROM ${createFromExpression()} "
        return q
    }

    private String createFromExpression() {
        def tableField = escapeField(entityTable)
        return tableField
    }

}
