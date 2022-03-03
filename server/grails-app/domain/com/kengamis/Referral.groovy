package com.kengamis

class Referral {
    String id
    String date_of_referral
    String name_of_referring_officer
    String name_of_client_being_referred
    String phone_number
    String date_of_birth
    String age_category
    String country_of_origin
    String identification_document
    String identification_number
    String reason_for_referral
    String organization_referred_to
    String disability
    String received_feedback
    String feedback_given
    String date_of_feedback
    String followup_needed
    String followup_areas
    String status

    static mapping = {
        id generator: 'uuid2'
    }

    static constraints = {
        date_of_referral nullable: false
        name_of_referring_officer nullable: false
        name_of_client_being_referred nullable: false
        phone_number nullable: false
        date_of_birth nullable: false
        age_category nullable: false
        country_of_origin nullable: false
        identification_document nullable: false
        identification_number nullable: false
        reason_for_referral nullable: false
        organization_referred_to nullable: false
        disability nullable: false
        status nullable: false
        received_feedback nullable: true
        feedback_given nullable: true
         date_of_feedback nullable: true
        followup_needed nullable: true
        followup_areas nullable: true
    }

    @Override
    // Override toString for a nicer / more descriptive UI
    public String toString() {
        return "${name_of_client_being_referred}"
    }
}
