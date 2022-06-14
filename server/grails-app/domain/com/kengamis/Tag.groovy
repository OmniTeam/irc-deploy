package com.kengamis

class Tag {

    String id
    String name
    Date dateCreated
    Date lastUpdated

    static belongsTo = [tagType: TagType, partner: ProgramPartner]
    static mapping = {
        id generator: 'uuid2'
    }
    static constraints = {
        partner nullable: true, blank: false
    }

    /*
     * Methods of the Domain Class
     */
    @Override	// Override toString for a nicer / more descriptive UI
    public String toString() {
        return "${name}"
    }
}
