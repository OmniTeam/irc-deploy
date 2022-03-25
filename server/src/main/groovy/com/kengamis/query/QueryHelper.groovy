package com.kengamis.query

import com.kengamis.*
import groovy.util.logging.Log4j
import org.openxdata.markup.XformType
import org.springframework.security.access.AccessDeniedException

import static com.kengamis.AppHolder.withMisSql
import static com.kengamis.AppHolder.withMisSqlNonTx
import static com.kengamis.Util.*

/**
 * Helps in generating  queries and filters in SQL that are context sensitive.
 *
 * - If a user is not an admin then user filter is created to return only data that was created by that user
 * - If a user is a group supervisor then user in that group are also added into the user filter
 *
 */
@Log4j
class QueryHelper {


    public static final String IGNORE_FILTER = '_NONE_'
    Map params
    List<FormSetting> headers
    List<FormSetting> formQuestions
    User currentUser
    String userBaseTable
    String dbPrefix

    /**
     * Params can include: offset,max,search,filter|_xxx,formtable,noFormSetting
     * @param params
     * @param currentUser
     */
    QueryHelper(Map params, User currentUser) {
        def config = Config.default

        if (params.noFormSetting) {
            config.remove(Config.LOAD_FORM_LABELS)
        }

        if (params.noSecurity) {
            config.remove(Config.CHECK_TABLE_SECURITY)
        }

        if(params.dbPrefix){
            config.remove(Config.NO_DB_PREFIX)
        }

        init(config, params, currentUser)
    }

    QueryHelper(EnumSet<Config> config, Map params, User currentUser) {
        init(config, params, currentUser)
    }

    private void init(EnumSet<Config> config, Map params, User currentUser) {
        this.params = params
        if (Config.LOAD_FORM_LABELS in config) {
            def form = getForm()
            headers = FormSetting.findAllByFormAndViewInTable(form, true, [sort: "orderOfDisplayInTable"])
            formQuestions = FormSetting.findAllByForm(form)
            initBaseTable()
        }
        this.currentUser = currentUser
        if(!(Config.NO_DB_PREFIX in config)){
            initDbPrefix()
        }


    }

    void initBaseTable() {
//        if (hasGroups()) {
            setUserBaseTable(formTable)
//        }
    }

    boolean useDbPrefix() {
        return (params.dbPrefix != null)
    }

    void initDbPrefix(){
        setDbPrefix(params.dbPrefix)
    }

    Form getForm() {
        return Form.findByName(getFormTable())
    }

    String getQuery() {
        def queryFields = queryFields()

        def fields = { queryFields.join(',') }
        def sorting = { sortClause(params) }
        def q = _query(fields, sorting)
        return q
    }

    String sortClause(Map params) {

        String[] sort
        if (params['sort'] instanceof Collection)
            sort = ((Collection) params['sort']).collect { it?.toString() } as String[]
        else if (params['sort'] instanceof String)
            sort = [params['sort']] as String[]
        def direction = 'desc' == params['order'] ? 'DESC' : 'ASC'
        if (sort) return "ORDER BY ${sort.collect { resolveFieldName(splitQualifiedColumn(it)) }.join(',')} $direction"
        return ''
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

    List<FormSetting> getFilters() { headers.findAll { it.addToFilter && it.viewInTable } }

    private String _query(Closure generateFields, Closure<String> sortFields = { "" }) {

        def finalWhereClause = getWhereClause()

        def q = "SELECT ${generateFields()} FROM ${createFromExpression()} "
        if (finalWhereClause) q = "$q WHERE ${finalWhereClause} "
        q = q + sortFields()

        return q
    }

    private String createFromExpression() {

        def tableField = escapeField(formTable)

        if (hasGroups()) {
            def groups = headers
                    .findAll { it.parentFormSetting?.xformType in [XformType.GROUP.value, XformType.REPEAT.value] }
                    .collect { it.resolveParentTableName() }
                    .unique()
            def tableExpression = formTable
            return [tableExpression, *groups].collect { escapeField it }.inject { acc, val ->
                "${resolveFieldName acc} ${joinType} JOIN ${resolveFieldName val} on ${resolveFieldName val}.parentId = ${resolveFieldName tableField}.__id"
            }

        } else {
            return resolveFieldName(tableField)
        }

    }

    private String _joinType = 'LEFT'

    String getJoinType() {
        return _joinType
    }

    QueryHelper setJoinType(String joinType) {
        if (joinType.toLowerCase() in ['inner', 'left', 'right']) {
            _joinType = joinType.toUpperCase()
        }
        return this
    }

    String getWhereClause(def defaultValue = "") {
        def searchFilter = getSearchFilterExpr()
        def fieldFilter = getFieldFilterExpr()
        def userFilter = getUserFilter()
        def dateRangeFilter = getDateRangeFilterExpr()
        def finalWhereClause = [searchFilter, fieldFilter, userFilter, dateRangeFilter].findAll().join(' AND ')?.trim()

        if (!finalWhereClause) return defaultValue
        return finalWhereClause
    }

    private String getSearchFilterExpr() {
        if (headers && params.search) {
            String wildCard = getSqlWildCard(params.search as String)
            if (wildCard) {
                def usernames = withMisSql { rows("SELECT username from user where username LIKE '${wildCard}' ".toString()) }
                if (usernames) {
                    def searchExpr = queryFields().collect { "${resolveFieldName it} LIKE '${wildCard}'" }.join(' or ')
                    return "($searchExpr or submitterName in (${usernames.collect { "'${escapeSql it['username'] as String}'" }.join(',')}))"
                }
                else  {
                    def searchExpr = queryFields().collect { "${resolveFieldName it} LIKE '${wildCard}'" }.join(' or ')
                    return "($searchExpr)"
                }
            }
        }
        return null
    }

    private String getUserFilterExpr() {
        if (!currentUser) return null
        if (currentUser.hasAnyRole('ROLE_ADMIN', 'ROLE_SUPER_ADMIN')) return null


        def userNames = []
        if (!userNames) {
            if (currentUser.username) {
                userNames = [currentUser.username]
            } else {
                throw new AccessDeniedException("You Do Not Have Access To View This Data")
            }
        }
        if (hasGroups())
            return "(${resolveFieldName(escapeField(userBaseTable))}.`submitterName` in (${userNames.collect { "'${escapeSql it}'" }.join(',')}))"
        return "(${resolveFieldName("`submitterName`")} in (${userNames.collect { "'${escapeSql it}'" }.join(',')}))"
    }

    private String getUserFilter() {
        if (params.userFilter) {
            if (userBaseTable)
                return "(${escapeField userBaseTable}.submitterName = '${escapeSql params.userFilter}')"
            else
                return "(submitterName = '${escapeSql params.userFilter}')"
        }
        return null
    }

    private String getDateRangeFilterExpr() {
        if (params.dateFrom && params.dateTo) {
            if (userBaseTable)
                return "(${escapeField userBaseTable}.submissionDate BETWEEN '${escapeSql params.dateFrom}' AND '${escapeSql params.dateTo}')"
            else
                return "(submissionDate BETWEEN '${escapeSql params.dateFrom}' AND '${escapeSql params.dateTo}')"
        }
        return null
    }

    private String getFieldFilterExpr() {
        if (params.filter) {
            def filterKeys = params.keySet().findAll { "$it".startsWith("filter|") }

            if (!filterKeys) return null

            def filterParts = filterKeys.collect {
                def field = "$it".replaceFirst(/filter\|/, "")
                def value = params[it]

                //Values from Maps are also not supported
                if (value == IGNORE_FILTER || value instanceof Map) return null

                return createFilterString(field, value)

            }.findAll()

            if (filterParts?.size() == 1) return filterParts[0]
            if (filterParts?.size() > 1) return "(${filterParts.join(' AND ')})"
            else return null
        }
        return null
    }

    private String createFilterExpr(String field, CharSequence value) {
        if (!field || !value) return null

        Object fieldPart = splitQualifiedColumn(field)
        return "${resolveFieldName fieldPart} LIKE '%${escapeSql value}%'"
    }

    static String splitQualifiedColumn(String field) {
        def fieldPart = escapeField(field)
        if (field.contains('.') || field.contains('-')) {
            def parts = field.split('\\.|-')
            def tableName = parts[0]
            def otherPart = parts[1..-1].join('.')
            fieldPart = "${escapeField(tableName)}.${escapeField(otherPart)}"
        }
        return fieldPart
    }

    private String createFilterString(String field, String[] values) {
        if (values.contains(IGNORE_FILTER)) return null
        def conditionExpression = values.collect { value -> createFilterExpr(field, value) }.findAll().join(' OR ')
        if (values?.size() == 1) return conditionExpression
        return "( $conditionExpression )"
    }

    //todo  do not add fields whose columns do not exist
    List<String> queryFields() {
        def groups = hasGroups()
        def rt = groups ? ["`$formTable`.`__id` as `parentId`"] : ['`__id`', '`submitterName`', '`submissionDate`']
        if(useDbPrefix()){
            rt = rt.collect {addDbPrefixToField(it)}
        }
        if (!headers) {
            rt = ['*']
        } else {
            rt.addAll headers.collect { field ->
                def field1
                if (groups) {
                    field1 =   "$field.sqlQualifiedColumnNameWithoutTruncating"
                } else {
                    field1 = escapeField(field.truncatedColumnName())
                }
                if(useDbPrefix()){
                   field1 = addDbPrefixToField(field1)
                }
                field1

            }
        }
        return rt.unique()
    }

    private String resolveFieldName(String field) {
        if (useDbPrefix()) {
            return  "${escapeField dbPrefix}.${field}"
        } else {
            return field
        }
    }

    private String addDbPrefixToField(String field){
        if (hasGroups()) {
            field = "`$dbPrefix`.$field"
        } else {
            field = "`$dbPrefix`.${escapeField userBaseTable}.$field"
        }
        return field
    }


    boolean hasGroups() {
        return headers.any { it.parentFormSetting?.xformType in [XformType.GROUP.value, XformType.REPEAT.value] }
    }

    String getFormTable() { params.formtable }

    List<Map> getData() {
        log.trace("Query: Fetching Data: [$query]")
        withMisSqlNonTx { rows("$query".toString()) }
    }

    List<Map> getFormDataCollectors() {
        def userQuery = "select distinct submitterName from $formTable order by submitterName asc"
        log.trace("Query: Fetching User Data: [$userQuery]")
        withMisSqlNonTx { rows("$userQuery".toString()) }
    }

    static enum Config {
        CHECK_TABLE_SECURITY, LOAD_FORM_LABELS,NO_DB_PREFIX

        static EnumSet<Config> getDefault() { EnumSet.of(CHECK_TABLE_SECURITY, LOAD_FORM_LABELS) }

        static EnumSet<Config> getNone() { EnumSet.noneOf(Config) }
    }

    QueryHelper cleanUpHeader(){
        headers = headers.unique { it.field }
        return this
    }
}




