package com.kengamis

class ReportFormFinancial {

    String id
    String reportId
    String budgetLine
    String approvedBudget
    String expenseToDate
    String totalAdvanced
    String variance
    String quarterExpenses
    String reasonForVariance

    Date dateCreated
    Date lastUpdated

    static mapping = {
        id generator: 'uuid2'
        reasonForVariance type: 'text'
    }
    static constraints = {
        approvedBudget nullable: true
        expenseToDate nullable: true
        totalAdvanced nullable: true
        variance nullable: true
        quarterExpenses nullable: true
        reasonForVariance nullable: true
    }
}
