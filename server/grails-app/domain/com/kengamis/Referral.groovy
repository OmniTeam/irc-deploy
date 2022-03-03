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
    String nationality_status
    String feedback_given
    String date_of_feedback
    String followup_needed
    String followup_areas
    String followup_organization
    String status

    static mapping = {
        id generator: 'uuid2'
    }

    static constraints = {
        date_of_referral nullable: false
        name_of_referring_officer nullable: false
        name_of_client_being_referred nullable: false
        phone_number nullable: true
        date_of_birth nullable: true
        age_category nullable: true
        country_of_origin nullable: true
        identification_document nullable: true
        identification_number nullable: true
        reason_for_referral nullable: true
        organization_referred_to nullable: true
        disability nullable: true
        status nullable: true
        received_feedback nullable: true
        nationality_status nullable: true
        feedback_given nullable: true
         date_of_feedback nullable: true
        followup_needed nullable: true
        followup_areas nullable: true
        followup_organization nullable: true
    }

    @Override
    // Override toString for a nicer / more descriptive UI
    public String toString() {
        return "${name_of_client_being_referred}"
    }
}
