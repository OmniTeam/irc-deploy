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

    Date dateCreated
    Date lastUpdated

    static mapping = {
        id generator: 'uuid2'
    }
    static constraints = {
        budgetLine nullable: true
        approvedBudget nullable: true
        expenseToDate nullable: true
        totalAdvanced nullable: true
        variance nullable: true
        quarterExpenses nullable: true
    }
}
