package com.kengamis

class PeopleReferred {
    String id
    String activityId
    String female18
    String male18
    String female36
    String male36
    String femaleNationals
    String maleNationals
    String femaleRefugee
    String maleRefugee
    String malePwd
    String femalePwd

    static mapping = {
        id generator: 'uuid2'
    }

    static constraints = {
        activityId nullable: false
        female18 nullable: true
        male18 nullable: true
        female36 nullable: true
        male36 nullable: true
        femaleNationals nullable: true
        maleNationals nullable: true
        maleRefugee nullable: true
        femaleRefugee nullable: true
        malePwd nullable: true
        femalePwd nullable: true
    }
}
