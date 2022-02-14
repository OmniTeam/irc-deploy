package com.kengamis

class Tag {

    String id
    String name
    Date dateCreated
    Date lastUpdated

    static belongsTo = [tagType: TagType]
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
