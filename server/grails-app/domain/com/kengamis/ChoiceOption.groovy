package com.kengamis

import grails.compiler.GrailsCompileStatic

@GrailsCompileStatic
class ChoiceOption implements Serializable {

    private static final long serialVersionUID = 1

    String id
    String choiceId
    String text

    static constraints = {
        choiceId nullable: false
        text nullable: false
    }
    static belongsTo = [formSetting: FormSetting]

    static mapping = {
        text type: 'text'
    }
}
