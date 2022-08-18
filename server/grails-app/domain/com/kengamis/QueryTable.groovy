package com.kengamis

class QueryTable {
    String id
    String kengaGroupId
    int permission
    String query


    static constraints = {
    }
    static mapping = {
        id generator: 'uuid2'
        query type: "text"
        cache true
    }

    @Override	// Override toString for a nicer / more descriptive UI
    public String toString() {
        return "${query}"
    }

    static Object create(kengaGroupId, permission, queryArray){
        def instance = new QueryTable(kengaGroupId: kengaGroupId,permission: permission, query: queryArray)
        instance.save(flush: true, failOnError: true)
    }
}
