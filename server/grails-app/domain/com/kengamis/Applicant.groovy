package com.kengamis

class Applicant {

    String id
    String username
    String password
    String grantId
    String email
    String names
    String organization
    User user

    static constraints = {
    }

    static mapping = {
        id generator: 'uuid2'
    }
}
