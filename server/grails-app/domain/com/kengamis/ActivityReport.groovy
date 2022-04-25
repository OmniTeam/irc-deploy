package com.kengamis

class ActivityReport {
    String id
    String budgetLine
    String name
    String startDate
    String endDate
    String designation
    String location
    String milestone
    String activityObjectives
    String activityResults
    String activityUndertaken
    String challenges
    String lessonsLearned
    String keyAchievements
    String peopleReached
    String costAssociated
    String budgetProgress
    String assignee
    String attachPhoto
    String attachList
    String attachStory


    static mapping = {
        id generator: 'uuid2'
    }

    static constraints = {
         budgetLine nullable: false
         name nullable: false
         startDate nullable: false
         endDate nullable: false
         designation nullable: false
         location nullable: false
         milestone nullable: false
         activityObjectives nullable: true
         activityResults nullable: true
         activityUndertaken nullable: true
         challenges nullable: true
         lessonsLearned nullable: true
         keyAchievements nullable: true
         peopleReached nullable: true
         costAssociated nullable: true
         budgetProgress nullable: true
         assignee nullable: true
         attachPhoto nullable: true
         attachList nullable: true
         attachStory nullable: true
    }
}
