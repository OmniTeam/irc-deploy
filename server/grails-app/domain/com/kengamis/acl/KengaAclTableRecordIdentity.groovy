package com.kengamis.acl

import com.kengamis.KengaGroup

class KengaAclTableRecordIdentity {
    //kenga table where the record comes from
    KengaDataTable kengaDataTable
    //the id of the record in this table
    String dataTableRecordId
    //optional owner group
    KengaGroup kengaGroup
    static constraints = {
        kengaGroup nullable: true
        kengaDataTable nullable: false
        dataTableRecordId nullable: false

    }
}
