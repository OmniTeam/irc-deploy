package com.kengamis

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@EqualsAndHashCode(includes='authority')
@ToString(includes='authority', includeNames=true, includePackage=false)
class Role implements Serializable {

	private static final long serialVersionUID = 1

	String id
	String authority

	Date dateCreated
	Date lastUpdated

	static hasMany = [userRoles: UserRole]

	static constraints = {
		authority nullable: false, blank: false, unique: true
	}

	static mapping = {
		//cache true
	}
}
