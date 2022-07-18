package com.kengamis

class ReportFormPerformance {

    String id
    String reportId
    String milestoneId
    String outputIndicators
    String overallTarget
    String cumulativeAchievement
    String quarterAchievement
    String quarterTarget
    String percentageAchievement
    String commentOnResult

    Date dateCreated
    Date lastUpdated

    static mapping = {
        id generator: 'uuid2'
        commentOnResult type: 'text'
    }
    static constraints = {
        overallTarget nullable: true
        milestoneId nullable: true
        cumulativeAchievement nullable: true
        quarterAchievement nullable: true
        quarterTarget nullable: true
        percentageAchievement nullable: true
        commentOnResult nullable: true
    }
}
