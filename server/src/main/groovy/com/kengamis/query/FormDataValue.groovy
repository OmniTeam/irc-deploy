package com.kengamis.query

import com.kengamis.ChoiceOption
import com.kengamis.FormSetting
import com.kengamis.Util
import grails.util.Holders
import groovy.transform.ToString
import groovy.util.logging.Log4j
import org.openxdata.markup.XformType

@Log4j
class FormDataValue {

    private def SELECT_TYPES = [XformType.SELECT, XformType.SELECT1, XformType.SELECT1_DYNAMIC]*.value
    private def REPEATS = XformType.REPEAT.value
    private def PICTURES = XformType.PICTURE.value
    FormSetting formSetting
    def value

    List<Option> getOptions() {

        if (!value || !(formSetting.xformType in SELECT_TYPES))
            return Collections.EMPTY_LIST

        //Assert.isInstanceOf(String, value)

        def strValue = value as String
        def strOptions = strValue.split(/\s+/)

        return strOptions.collect {
            new Option(bindValue: it, option: formSetting.findChoiceOption(it))
        }
    }

    List getMultiSelectOptions() {

        if (!value || !(formSetting.xformType in SELECT_TYPES))
            return Collections.EMPTY_LIST

        //Assert.isInstanceOf(String, value)

        def strValue = value as String
        def strOptions = strValue.split(/\s+/)

        return strOptions.collect {
            [bindValue: it, option: formSetting.findChoiceOption(it).text]
        }
    }

    List getRepeatHeaders() {
        if (!value || !(formSetting.xformType = REPEATS))
            return Collections.EMPTY_LIST

        def repeatFormData = value as List<FormData>
        def repeatFirstRecord = repeatFormData.first().allFormDataValues
        def headers = []
        headers << [field: 'increment', questionText: '#']
        repeatFirstRecord.each { header ->
            if (header.humanReadableValue) {
                if (!header.isMetaColumn()) {
                    headers << [field: header.field, questionText: header.label]
                }
            }
        }
        return headers
    }

    List getRepeatData() {
        def resultList = []
        if (!value || !(formSetting.xformType = REPEATS))
            return Collections.EMPTY_LIST

        def repeatFormData = value as List<FormData>
        def counter = 1
        repeatFormData.each { value ->
            def formDataValues = value.allFormDataValues
            def record = [:]
            record["increment"] = counter
            formDataValues.each {dataValue ->
                record["${dataValue.field}"] = dataValue.humanReadableValue
            }
            resultList << record
            counter++
        }
        return resultList
    }

    String getImagePath() {
        if (!value || !(formSetting.xformType = PICTURES))
            return null

        def strValue = value as String
        def baseFolder = Holders.grailsApplication.config.imageFolder
        def imageFilePath = (baseFolder + strValue) as String
        return imageFilePath
    }

    String getHumanReadableValue() {
        def finalValue
        if (formSetting.xformType in SELECT_TYPES) {
            finalValue = getOptions()*.textValue.join(', ')
            if (!finalValue) {
                finalValue = Util.tryOxdUnEscape(value)
            }
        } else if (value instanceof Number) {
            finalValue = numberToString(value)
        } else {
            finalValue = value
        }
        return finalValue
    }

    String getLabel() {
        formSetting.questionText

    }

    String getField() {
        formSetting.field

    }


    static boolean isFloatingPoint(def val) {

        return Float.TYPE.isInstance(val) ||
                Double.TYPE.isInstance(val) ||
                val instanceof Float ||
                val instanceof Double
    }

    static String numberToString(Number number) {

        if (number instanceof BigDecimal) {
            return number.stripTrailingZeros().toPlainString()
        }

        if (isFloatingPoint(number)) {
            new BigDecimal(number.doubleValue()).stripTrailingZeros().toPlainString()
        }

        return number.toString()

    }

    private final static META_COLUMN_NAMES = ['__id',
                                                'submitterName',
                                                'unique_id',
                                                '__start',
                                                '__end',
                                                '__today',
                                                'instanceID',
                                                '__reviewed',
                                                '__reviewedBy',
                                                'edits',
                                                'deviceId',
                                                'parentId',
                                                'attachmentsPresent',
                                                'attachmentsExpected']*.toLowerCase()

    boolean isMetaColumn() {
        return META_COLUMN_NAMES.contains(formSetting.field.toLowerCase())
    }

    static class Option {
        String bindValue
        ChoiceOption option

        String getTextValue() {
            return option?.text ?: Util.tryOxdUnEscape(bindValue)
        }
    }

}
