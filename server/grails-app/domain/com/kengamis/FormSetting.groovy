package com.kengamis

import grails.compiler.GrailsCompileStatic
import org.openxdata.markup.XformType

@GrailsCompileStatic
class FormSetting implements Serializable {

    private static final long serialVersionUID = 1

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
    }

    FormSetting addOptionIfAbsent(ChoiceOption choiceOption) {
        if (!choiceOptions.any { it.choiceId == choiceOption.choiceId }) {
            addToChoiceOptions(choiceOption)
        }
        return this
    }

    ChoiceOption findChoiceOption(String bindValue) {
        return choiceOptions?.find { it.choiceId == bindValue }
    }
}
