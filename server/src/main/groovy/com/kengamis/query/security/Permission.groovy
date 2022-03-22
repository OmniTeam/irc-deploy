package com.kengamis.query.security

import org.springframework.security.acls.domain.BasePermission

/**
 * A class that extends <code>BasePermission</code> that allows you to extend the default
 * spring security permissions.
 * @author kakavi
 */
class Permission extends BasePermission{

    static Permission READ = new Permission(1)
    static Permission WRITE = new Permission(2)
    static Permission CREATE = new Permission(4)
    static Permission DELETE = new Permission(8)
    static Permission ADMIN = new Permission(16)

    Permission(int mask) {
        super(mask)
    }

    /**
     * creates a mask value after OR ing' different permission masks
     * @param permissions
     * @return
     */
    static int createPermissionsMask(List<Permission> permissions) {
        int mask = 0
        for(permission in permissions) {
            mask = mask | permission.mask
        }
        return mask
    }

    /**
     * checks whether a given Mask contains a certain permission
     * @param permission
     * @param mask
     */
    static boolean hasPermission(int mask, Permission permission) {
        int result = mask & permission.mask
        return result
    }
}
