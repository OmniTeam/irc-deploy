package com.kengamis.query.security

import com.kengamis.KengaGroup
import com.kengamis.KengaGroupRole
import org.springframework.security.core.Authentication

class kengaGroupPermissionEvaluator implements IKengaGroupPermissionEvaluator{
    @Override
    boolean hasPermission(Authentication authentication, String targetTable, Object permission) {
        if(targetTable == null) {
            return false
        }
        return false
    }

    private boolean checkPermission(Authentication authentication, String targetTable, Object permission) {
        //get groups applicable to the principle
        List<KengaGroup> groups = retrieveKengaGroups(authentication)
    }

    List<KengaGroup> retrieveKengaGroups(Authentication authentication) {
        KengaGroupRole.find
        null
    }
}
