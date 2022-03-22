package com.kengamis.acl

class KengaDataTable {
    String tableName
    String idLabel

    static constraints = {
        tableName nullable: false, unique: true, blank: false
        idLabel nullable: true
    }
}
