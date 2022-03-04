package com.kengamis.query.security

import org.springframework.security.core.Authentication

/**
 * Determines whether a group has a permission or permissions for a given table
 * @author Kakavi
 */
interface IKengaGroupPermissionEvaluator {

    /**
     * @param authentication represents the user in question. should not be null
     * @param targetTable the table for which the permission should be
     * checked. Maybe null in which case implementations should return false, as the null condition
     * can be checked explicitly in the expression.
     * @param permission a representation of the permission object
     * @return true if the permission is granted, false otherwise
     */
    boolean hasPermission(Authentication authentication, String targetTable, Object permission);
}
