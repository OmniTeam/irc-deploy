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
    String status
    String comments
    String activityName
    String organization
    Date dateCreated
    Date lastUpdated


    static mapping = {
        id generator: 'uuid2'
    }

    static constraints = {
         budgetLine nullable: true
         name nullable: true
         startDate nullable: true
         endDate nullable: true
         designation nullable: true
         location nullable: true
         milestone nullable: true
         activityObjectives nullable: true
         activityResults nullable: true
         activityName nullable: true
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
         comments nullable: true
         organization nullable: true
         status nullable: true
    }
}
