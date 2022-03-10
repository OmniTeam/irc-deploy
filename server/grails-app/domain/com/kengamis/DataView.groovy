package com.kengamis

class DataView {

    String id
    String name
    String tableName
    String description
    String viewQuery
    boolean ignoreUserContext = false
    Date dateCreated
    Date lastUpdated

    static mapping = {
        id generator: 'uuid2'
        viewQuery type: 'text'
    }

    static constraints = {
        viewQuery nullable: true
        description nullable: true
        tableName nullable: false
    }

    /*
     * Methods of the Domain Class
     */
    @Override	// Override toString for a nicer / more descriptive UI
    public String toString() {
        return "${name}"
    }

}
