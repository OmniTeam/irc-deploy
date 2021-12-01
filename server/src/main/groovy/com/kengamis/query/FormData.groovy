package com.kengamis.query

import com.kengamis.*
import com.softkiwi.algorithms.graphs.DefaultGraph
import groovy.transform.Memoized
import groovy.util.logging.Log4j
import org.jooq.DSLContext
import org.openxdata.markup.XformType
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.util.Assert

import static com.kengamis.JooqUtil.*

@Log4j
class FormData {

    static def SELECT_TYPES = [XformType.SELECT, XformType.SELECT1, XformType.SELECT1_DYNAMIC]*.value


    Form form
    String id
    String tableName
    FormSetting formSetting
    String parentId


    private DSLContext jooq = AppHolder.bean(DSLContext)
    private DataService dataService = AppHolder.bean(DataService)
    private Map record

    FormData setForm(Form form1) {
        this.form = form1
        this.tableName = form1.name
        return this
    }

    FormData setTableName(String tableName1) {
        this.tableName = tableName1
        return this

    }

    FormData load() {
        record = jooq.selectFrom(table(tableName))
                .where(field('__id').eq(id))
                .fetchOneMap()
        return this
    }

    FormData loadByUniqueId(String uniqueId){
        record = jooq.selectFrom(table(tableName))
                .where(field('unique_id').eq(uniqueId))
                .fetchOneMap()
        this.setId(record.get('__id'))
        return this
    }

    FormData lazyLoad() {
        def headers = FormSetting.findAllByFormAndViewInTable(form, true, [sort: "orderOfDisplayInTable"])
        def selectFields = headers.collect { field(it.field) }
        record = jooq.select(selectFields)
                .from(table(tableName))
                .where(field('__id').eq(id))
                .fetchOneMap()
        return this
    }

    static FormData load(String id, String formName) {
        return load(id, Form.findByName(formName))
    }

    static FormData load(String id, Form form) {
        return init(id, form).load()
    }

    String getOxdId() {
        return getAt('openxdata_form_data_id').value
    }

    static def getFieldValue(String id, String field, String formTable) {
        return load(id, formTable).getDataFor(field)?.value
    }

    List<FormSetting> getAllSelects() {
        form.formSettings.findAll { it.xformType in SELECT_TYPES } as List
    }

    FormDataValue getAt(String fieldName) {
        return getDataFor(fieldName)
    }

    @Memoized
    FormDataValue getDataFor(String fieldName) {

        def value
        if (record) {
            value = record.get(fieldName)
        } else {
            value = jooq.select(field(fieldName))
                    .from(table(form.name))
                    .where(field('__id').eq(id))
                    .fetchOne()
                    .value1()
        }

        def formDataValue = new FormDataValue(value: value,
                formSetting: findOrCreateFormSetting(fieldName))

        return formDataValue

    }

    void updateField(String fieldName, def value) {
        jooq.update(table(form.name))
                .set(field(fieldName), value)
                .where(field('__id').eq(id))
                .execute()
    }

    List<FormDataValue> getAllFormDataValues() {
        return record.collect { getDataFor(it.key) }.sort { it.formSetting.orderOfDisplayInTable }
    }

    private FormSetting findOrCreateFormSetting(String fieldName) {
        def setting = form.findFormSetting(fieldName)
        if (!setting) {
            setting = new FormSetting(questionText: Util.tryOxdUnEscape(fieldName), field: fieldName, form: form)
        }
        return setting
    }

    String toString() {
        return "${record?.size()} Columns"
    }

    static FormData init(String id, String formName) {
        Assert.notNull(formName, 'Cannot Initialize Data With Empty Form Name')
        return init(id, Form.findByName(formName))
    }

    static FormData init(String id, Form form) {
        Assert.notNull(form, 'Cannot Initialize Data With Empty Form')
        return new FormData(id: id, form: form)
    }

    static FormData init(Form form) {
        Assert.notNull(form, 'Cannot Initialize Data With Empty Form')
        return new FormData(id: "", form: form)
    }

    List<String> query(String returnField, FormSetting conditionSetting, def value) {
//    ToDo fix situations where some settings are in repeat questions
       /* if (conditionSetting.parentFormSetting && conditionSetting.parentFormSetting.xformType == XformType.REPEAT.value) {
            tableName = conditionSetting.parentFormSetting.tableName
        }*/
        try{
            List<String> result = jooq.select(field(returnField))
                    .from(table(tableName))
                    .where(field(conditionSetting.field).eq(value))
                    .fetchMaps().collect { it.get(returnField) }

            return result
        }catch(Exception ex){
           log.error(ex.getMessage())
        }
        return Collections.EMPTY_LIST
    }

}



