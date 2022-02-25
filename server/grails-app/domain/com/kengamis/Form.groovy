package com.kengamis

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import org.openxdata.markup.XformType

class Form {

    final static String TABLE_POSTFIX = 'xxx'

    String id
    String name
    String displayName
    String description
    Date dateCreated
    Date lastUpdated
    boolean enabled = true
    boolean syncMode = true
    String centralId

    static hasMany = [formSettings: FormSetting]
    static belongsTo = [study: Study]

    static mapping = {
        id generator: 'uuid2'
    }
    static constraints = {
        name nullable: false
        description nullable: true
        centralId nullable: false
        displayName nullable: false
    }

    @Override
    public String toString() {
        return "${displayName}";
    }

    String humanReadableName() {
        return displayName
    }


    boolean hasViewableColumns() {
        if (id == null)
            return false

        def settings = FormSetting.findByViewInTableAndForm(true, this)

        if (settings) {
            return true
        } else {
            return false
        }
    }

    boolean hasFormSetting(Form form, String field) {
        if (id == null)
            return false

        def settings = FormSetting.findByFormAndField(form, field)

        if (settings) {
            return true
        } else {
            return false
        }
    }

    FormSetting findFormSetting(String questionId) {
        formSettings.find { it.field == questionId }
    }


    static List<Form> getMisForms(String studyId) {
        //noinspection UnnecessaryQualifiedReference
        def study = Study.get(studyId)
        if (study) {
            def forms = findAllByStudyAndEnabled(study, true, [sort: 'displayName', order: 'asc'])
            return forms
        }
        return Collections.EMPTY_LIST
    }

    String getRepeatTablePrefix() {
        if ((study.syncMode == Study.SYNC_MODE_NEW)) {
            return "__${centralId}__"
        }
        return "${name}_"
    }

    List<FormSetting> findAllRepeatAndGroupQns() {
        //todo do proper group support as in do not treat groups as repeats
        formSettings.findAll { it.xformType in [XformType.REPEAT.value, XformType.GROUP.value] } as List
    }

    List<String> resolveAllRepeatTableNames() {
        findAllRepeatAndGroupQns().collect { resolveGroupTableName(it.field) }
    }

    /**
     Returns a repeat table name with prefix given a question field
     */
    String resolveGroupTableName(String repeatQnField) {
        return "$repeatTablePrefix$repeatQnField"
    }

    List<FormSetting> findAllFirstLevelGroups() {
        formSettings.findAll { it.xformType == XformType.GROUP.value && !it.parentQuestion }
                .sort { it.orderOfDisplayInTable } as List
    }

    List<FormSetting> findAllFirstLevelQuestionsInFormAndFirstLevelGroups(int maxGroups = Integer.MAX_VALUE) {
        def firstLevelQuestions = findAllFirstLevelQuestions()
        def firstLevelGroups = findAllFirstLevelGroups()

        if (firstLevelGroups?.size() > maxGroups) {
            log.warn("Truncating groups to [${maxGroups}] ")
            firstLevelGroups = firstLevelGroups[0..maxGroups - 1]
        }

        def childQuestions = firstLevelGroups.collect { it.childQuestions }.flatten()


        firstLevelQuestions.addAll(childQuestions)

        return firstLevelQuestions
    }

    private List<FormSetting> findAllFirstLevelQuestions() {
        return formSettings.findAll {
            !it.parentQuestion && !(it.xformType in [XformType.GROUP.value, XformType.REPEAT.value])
        } as List<FormSetting>
    }

    static List getMisFormNames(String studyId) {
        return getMisForms(studyId).collect { it.name }
    }

    List<String> findAllChildTables() {
        List<FormSetting> formSettingList = formSettings.findAll { it.xformType in [XformType.REPEAT.value, XformType.GROUP.value, XformType.SELECT.value, XformType.SELECT1.value] } as List
        return formSettingList.collect {
            resolveGroupTableName(it.field)
        }
    }

    String truncateNameForSql() {
        if(name.size() > 63)
            return name.substring(0,63)
        return name
    }

    /**
     * Simple method to create a meta setting simply to reduce on boiler plate
     * It only sets the field and display and nothing else.
     */
    FormSetting metaSetting(String field, String display, String parent = null) {
        def setting = new FormSetting(field: field, displayName: display, form: this,
                parentQuestion: parent)
        return setting
    }

    FormSetting metaDateCreated(String parent = null) {
        metaSetting(FormSetting.META_DATE_CREATED, 'Date Created', parent)
    }

    FormSetting metaUsername(String parent = null) {
        metaSetting(FormSetting.META_USERNAME, 'Submitter Username', parent)
    }

    FormSetting metaUserId(String parent = null) {
        metaSetting(FormSetting.META_USER_ID, 'Submitter User Id', parent)
    }

    FormSetting metaId(String parent = null) {
        metaSetting(FormSetting.META_ID, 'Record Id', parent)
    }

}
