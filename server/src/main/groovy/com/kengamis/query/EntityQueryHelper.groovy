package com.kengamis.query

import com.kengamis.EntityFields
import com.kengamis.MisEntity
import com.kengamis.Tag
import com.kengamis.TagType
import com.kengamis.User
import groovy.util.logging.Log4j

import static com.kengamis.AppHolder.withMisSql
import static com.kengamis.AppHolder.withMisSqlNonTx
import static com.kengamis.Util.escapeField
import static com.kengamis.Util.escapeSql
import static com.kengamis.Util.escapeSql
import static com.kengamis.Util.extractId

@Log4j
class EntityQueryHelper {

    Map params
    List<EntityFields> headers
    User currentUser
    List<TagType> tagTypes
    String entityTable
    Boolean enableTagging

    EntityQueryHelper(Map params, User currentUser) {
        init(params, currentUser)
    }

    private void init(Map params, User currentUser) {
        this.params = params
        this.currentUser = currentUser
        def misEntity = getMisEntity()
        headers = EntityFields.findAllByMisEntity(misEntity, [sort: "orderOfDisplay", order: "asc"])
        tagTypes = TagType.findAllByMisEntity(misEntity)
        entityTable = misEntity.tableName
        enableTagging = misEntity.enableTagging

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
        withMisSqlNonTx { rows("$query".toString()) }
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
        def finalWhereClause = getWhereClause()
        def q = "SELECT ${generateFields()} FROM ${createFromExpression()} "
        if (finalWhereClause) q = "$q WHERE ${finalWhereClause} "
        return q
    }

    private String createFromExpression() {
        def tableField = escapeField(entityTable)
        return tableField
    }

    String getWhereClause(def defaultValue = "") {
        def tagTypeFilter = getTagTypeFilter()
        def tagFilter = getTagFilter()
        def finalWhereClause
        if (tagFilter && !tagTypeFilter) {
            finalWhereClause = [tagFilter].findAll().join(' AND ')?.trim()
        } else if (tagTypeFilter && !tagFilter) {
            finalWhereClause = [tagTypeFilter].findAll().join(' AND ')?.trim()
        } else {
            finalWhereClause = [tagFilter].findAll().join(' AND ')?.trim()
        }

        if (!finalWhereClause) return defaultValue
        return finalWhereClause
    }

    private String getTagTypeFilter() {
        def tagWhereClause = ""
        if (params.tagTypeFilter && enableTagging) {
            def id = params.tagTypeFilter as String
            def tagType = TagType.get(id)
            def tags = Tag.findAllByTagType(tagType).collect { it.name }
            if (tags) {
                def t = []
                tags.each {
                    t << " (_tag like '%${it}%') "
                }
                tagWhereClause = t.join(" OR ")
            } else { tagWhereClause = "(_tag is null)" }
        }
        return tagWhereClause
    }

    private String getTagFilter() {
        def tagWhereClause = ""
        if (params.tagFilter && enableTagging) {
            def id = params.tagFilter as String
            def tag = Tag.get(id).name
            if (tag) {
                tagWhereClause = " (_tag like '%${tag}%')"
            } else
                tagWhereClause = "(_tag is null)"
        }
        return tagWhereClause
    }

}
