package com.kengamis

import groovy.transform.ToString


@ToString(cache=true, includeNames=true, includePackage=false)
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
        id generator: 'uuid2'
        text type: 'text'
    }
}
