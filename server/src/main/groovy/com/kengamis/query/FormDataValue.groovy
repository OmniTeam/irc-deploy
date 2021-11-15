package com.kengamis.query

import com.kengamis.ChoiceOption
import com.kengamis.FormSetting
import com.kengamis.Util
import groovy.transform.ToString
import groovy.util.logging.Log4j
import org.openxdata.markup.XformType

@Log4j
class FormDataValue {

    private def SELECT_TYPES = [XformType.SELECT, XformType.SELECT1, XformType.SELECT1_DYNAMIC]*.value
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

    String getHumanReadableValue() {
        def finalValue
        if (formSetting.xformType in SELECT_TYPES) {
            finalValue = getOptions()*.textValue.join(',')
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

    private final static META_COLUMN_NAMES = ['Id',
                                              'openxdata_form_data_id',
                                              'openxdata_user_id',
                                              'openxdata_user_name',
                                              'openxdata_form_data_date_created',
                                              'parentId']*.toLowerCase()

    boolean isMetaColumn() {
        return META_COLUMN_NAMES.contains(field.toLowerCase())
    }

    static class Option {
        String bindValue
        ChoiceOption option

        String getTextValue() {
            return option?.text ?: Util.tryOxdUnEscape(bindValue)
        }
    }

}
