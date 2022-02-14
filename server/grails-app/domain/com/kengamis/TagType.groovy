package com.kengamis

class TagType {

    String id
    String name
    Date dateCreated
    Date lastUpdated

    static hasMany = [tags: Tag]
    static constraints = {
    }

    /*
     * Methods of the Domain Class
     */
    @Override	// Override toString for a nicer / more descriptive UI
    public String toString() {
        return "${name}"
    }
}
