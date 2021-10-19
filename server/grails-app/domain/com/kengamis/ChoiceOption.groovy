package com.kengamis

import grails.compiler.GrailsCompileStatic

@GrailsCompileStatic
class ChoiceOption {

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
