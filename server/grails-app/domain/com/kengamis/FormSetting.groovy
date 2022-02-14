package com.kengamis

import com.omnitech.odkodata2sql.SqlSchemaGen
import grails.gorm.transactions.Transactional
import groovy.transform.ToString
import org.openxdata.markup.XformType

@ToString(includes = 'displayName', includeNames = true, includePackage = false)
class FormSetting {

    final static SETTING_TEXT = 'text'
    final static SETTING_MULT_SELECT = 'multi-select'
    final static SETTING_REPEAT = 'repeat'
    final static SETTING_GROUP = 'group'
    final static GROUP_QUESTION_TYPES = [XformType.REPEAT.value, XformType.GROUP.value]

    String id
    String field
    String questionText
    String displayName
    int orderOfDisplayInTable = 1000
    boolean viewInTable = false
    boolean viewOnMap = false
    boolean addToFilter = false
    boolean filterByText = false
    String typeOfQuestion = SETTING_TEXT
    String xformType
    String parentQuestion
    Date dateCreated
    Date lastUpdated

    static belongsTo = [form: Form]
    static hasMany = [choiceOptions: ChoiceOption]

    static constraints = {
        field nullable: false
        questionText nullable: true
        displayName nullable: true
        typeOfQuestion nullable: false, inList: ['gps', 'picture', 'video', 'text', 'repeat', 'multi-select', 'group']
        parentQuestion nullable: true
    }

    static mapping = {
        sort 'displayName'
        questionText type: 'text'
        displayName type: 'text'
    }

    ChoiceOption findChoiceOption(String bindValue) {
        return choiceOptions?.find { it.choiceId == bindValue }
    }

    String getTableName() { form.resolveGroupTableName(field) }

    String getTruncatedTableName() { SqlSchemaGen.truncateForSql(getTableName()) }

    FormSetting getParentFormSetting() {
        if (!parentQuestion) return null
        return form.findFormSetting(parentQuestion)
    }

    String resolveParentTableName() {
        def setting = parentFormSetting
        if (!setting) return form.name
        return setting.tableName
    }

    String resolveTruncatedParentTableName() {
        SqlSchemaGen.truncateForSql(resolveParentTableName())
    }

    String truncatedColumnName() {
        return SqlSchemaGen.truncateForSql(field)
    }

    String getSqlQualifiedColumnName() {
        return "${Util.escapeField resolveTruncatedParentTableName()}.${Util.escapeField truncatedColumnName()}"
    }

    String getSqlQualifiedColumnNameWithoutTruncating(){
        return "${Util.escapeField resolveParentTableName()}.${Util.escapeField truncatedColumnName()}"
    }


    FormSetting addOptionIfAbsent(ChoiceOption choiceOption) {
        if (!choiceOptions.any { it.choiceId == choiceOption.choiceId }) {
            addToChoiceOptions(choiceOption)
        }
        return this
    }
}
