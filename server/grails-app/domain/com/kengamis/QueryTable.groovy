package com.kengamis

class QueryTable {
    String id
    String kengaGroupId
    int permission
    String query
    String idLabel


    static constraints = {
    }
    static mapping = {
        id generator: 'uuid2'
    }

    @Override	// Override toString for a nicer / more descriptive UI
    public String toString() {
        return "${query}"
    }

    static def Object create(kengaGroupId,permission, query, idLabel){
        def instance = new QueryTable(kengaGroupId: kengaGroupId,permission: permission, query: query, idLabel: idLabel)
        instance.save(flush: true, failOnError: true)
    }
}
