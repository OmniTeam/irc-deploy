package com.kengamis

import grails.gorm.transactions.Transactional

@Transactional
class EntityViewFilterQueryService {

    def generateFullFilterQuery(name, groupName){
        def entity = EntityView.findByName(name)
        if (entity){
            def query = """
                SELECT ${entity.viewFields.collect { it.fieldType == 'Key Field' ? (it.name + ' as keyField') : it.name }.join(",")} FROM ${entity.tableName} WHERE ${(entity.viewFields.find {it ->if(it.name.contains('cluster')){it.name} } )}= '${groupName}'
                """.toString()
            def res = ["viewQuery": query]
            return res
        }
    }
}
