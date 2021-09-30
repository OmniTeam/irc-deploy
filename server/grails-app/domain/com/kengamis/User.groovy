package com.kengamis


import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@EqualsAndHashCode(includes = 'username')
@ToString(includes = 'username', includeNames = true, includePackage = false)
class User implements Serializable {

    private static final long serialVersionUID = 1

    String id
    String refId
//    as email on client
    String username
    String profilePhone
    String password
    boolean enabled = true
    String socialProvider = "none"
    boolean accountExpired
    boolean accountLocked
    boolean passwordExpired
    String firstName
    String lastName
    String middleName
    String telephone
    String countryCode
    String passwordRef
    Date dateCreated
    Date lastUpdated
    String gender
    String referralCode
    String source
    boolean ussdReferral = false
    //int updatedPsw = 0

    Boolean ussdPhoneActive = false
    String otpChannel
//    this is the field for KYC
    boolean isActive = false
    String kycStatus
    boolean ussdUpdated = false
    boolean sentVerifyProfileEmail = false
    String firebaseToken
    boolean accountVerified = false


    Set<Role> getAuthorities() {
        (UserRole.findAllByUser(this) as List<UserRole>)*.role as Set<Role>
    }

    static hasMany = [userRoles: UserRole]
    static constraints = {
        password nullable: false, blank: false, password: true
        username nullable: false, blank: false, unique: true
        profilePhone nullable: true, unique: true //login phone
        firstName nullable: true
        lastName nullable: true
        middleName nullable: true
        telephone nullable: true
        gender nullable: true
        refId nullable: true, unique: true
        passwordRef nullable: true
        ussdPhoneActive nullable: true
        socialProvider nullable: true
        //updatedPsw nullable: true
        otpChannel nullable: true
        source nullable: true
        firebaseToken nullable: true
        ussdReferral nullable: true, defaultValue: false
        referralCode nullable: true, unique: true
        kycStatus nullable: true
        sentVerifyProfileEmail nullable: true, defaultValue: false


    }

    static mapping = {
        password column: '`password`'
        ussdPhoneActive defaultValue: false
        ussdReferral defaultValue: false
        isActive defaultValue: false
        ussdUpdated defaultValue: false
        socialProvider defaultValue: "none"
    }

    def getFullName() {
        return "$firstName $lastName"
    }

    def isProfilePhoneAvailable() {
        return this.profilePhone != null
    }


    def roles() {
        return this.userRoles.collect { it.role }
    }

}
