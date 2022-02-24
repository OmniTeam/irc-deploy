package com.kengamis

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@EqualsAndHashCode(includes='authority')
@ToString(includes='authority', includeNames=true, includePackage=false)
class Role {

	static String ROLE_ADMIN = 'ROLE_ADMIN'
	static String ROLE_SUPER_ADMIN = 'ROLE_SUPER_ADMIN'

	String id
	String authority
	String description

	Date dateCreated
	Date lastUpdated

	static hasMany = [userRoles: UserRole]

	static constraints = {
		authority nullable: false, blank: false, unique: true
		description nullable: true
	}

	static mapping = {
		id generator: 'uuid2'
		//cache true
	}
}
