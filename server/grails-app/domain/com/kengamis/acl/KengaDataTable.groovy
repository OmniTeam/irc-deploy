package com.kengamis.acl

class KengaDataTable {
    String tableName

    static constraints = {
        tableName nullable: false, unique: true, blank: false
    }
}
