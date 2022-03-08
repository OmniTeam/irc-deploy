package com.kengamis.query.security

import com.kengamis.KengaGroup
import com.kengamis.KengaUserGroup
import com.kengamis.acl.KengaAclTableRecordIdentity
import com.kengamis.acl.KengaGroupAclEntry
import grails.plugin.springsecurity.acl.AclObjectIdentity
import groovy.util.logging.Slf4j
import org.springframework.security.acls.domain.DefaultPermissionFactory
import org.springframework.security.acls.domain.PermissionFactory
import org.springframework.security.acls.model.Acl
import org.springframework.security.acls.model.MutableAcl
import org.springframework.security.acls.model.NotFoundException
import org.springframework.security.core.Authentication
import org.springframework.security.acls.model.Permission
import org.springframework.util.Assert

@Slf4j
class kengaGroupPermissionEvaluator implements IKengaGroupPermissionEvaluator {
    private PermissionFactory permissionFactory = new DefaultPermissionFactory()

    @Override
    boolean hasPermission(Authentication authentication, String dataRecordId, Object permission) {
        if (dataRecordId == null) {
            return false
        }
        KengaAclTableRecordIdentity recordIdentity = getRecordIdentity(dataRecordId)
        return checkPermission(authentication, recordIdentity, permission)
    }

    KengaAclTableRecordIdentity getRecordIdentity(String dataRecordId) {
        def query = KengaAclTableRecordIdentity
                .where { tableRecordId == dataRecordId }
        KengaAclTableRecordIdentity tableRecordIdentity = query.find()
        return tableRecordIdentity
    }

    private boolean checkPermission(Authentication authentication, KengaAclTableRecordIdentity recordIdentity, Object permission) {
        //get groups applicable to the principle
        List<KengaGroup> groups = retrieveKengaGroups(authentication)
        List<Permission> requiredPermissions = resolvePermission(permission)
        log.debug("Checking permission: ${permission} for object:${recordIdentity}")

        try {
//            look for acls only for groups we are interested in
        } catch (NotFoundException exception) {
            log.debug("Returning false, no acls apply for this group")
        }
        return false

    }

    List<KengaGroup> retrieveKengaGroups(Authentication authentication) {
        def kengaGroups = KengaUserGroup.findAllGroups(authentication.principal)
        return kengaGroups
    }

    List<Permission> resolvePermission(Object permission) {
        if (permission instanceof Integer) {
//            check whether it builds correctly
            return Arrays.asList(this.permissionFactory.buildFromMask((Integer) permission))
        }
        if (permission instanceof Permission) {
            return Arrays.asList((Permission) permission)
        }
        if (permission instanceof Permission[]) {
            return Arrays.asList((Permission[]) permission);
        }
        throw new IllegalArgumentException("Unsupported permission: " + permission)
    }

    /**
     *
     * @param objectIdentities can be in formart [id:'xx',tableName:'yy']
     * @param groups
     * @return
     */
    protected Map<KengaAclTableRecordIdentity, Acl> lookupRecordIdentities(Collection<Object> objectIdentities,
                                                                           List<KengaGroup> groups) {
        Assert.notEmpty(objectIdentities, 'Must provide indentitites to look up...')
        Map<Serializable, Acl> acls = [:]

        List<KengaAclTableRecordIdentity> kengaAclTableRecordIdentities = KengaAclTableRecordIdentity.withCriteria {
            or {
                for(Object object: objectIdentities) {
                    and {
                        eq('dataTableRecordId', object.id)
                        eq('kengaDataTable',object.tableName)
                    }
                }
            }
            order('dataTableRecordId', 'asc')
        }
        Map<KengaAclTableRecordIdentity, List<KengaGroupAclEntry>> aclTableRecordIdentityListMap = findAcls(kengaAclTableRecordIdentities)

        List<KengaAclTableRecordIdentity> parents = convertEntries(aclTableRecordIdentityListMap,acls,groups)
        // Finally, convert our 'acls' into true Acls
    }

    protected Map<KengaAclTableRecordIdentity, List<KengaGroupAclEntry>> findAcls(List<KengaAclTableRecordIdentity> kengaAclTableRecordIdentities) {
        List<KengaGroupAclEntry> entries
        if(kengaAclTableRecordIdentities) {
            entries = KengaGroupAclEntry.withCriteria {
                'in'('kengaAclTableRecordIdentity', kengaAclTableRecordIdentities)
            }
        }

        def map = [:]

        for (KengaAclTableRecordIdentity kengaAclTableRecordIdentity: kengaAclTableRecordIdentities) {
            map[kengaAclTableRecordIdentity] = []
        }

        for(entry in entries) {
            map[entry.kengaAclTableRecordIdentity] << entry
        }

        return map
    }

    protected List<KengaAclTableRecordIdentity> convertEntries(
            Map<KengaAclTableRecordIdentity, List<KengaGroupAclEntry>> kengaAclTableRecordIdentityListMap,
    Map<Serializable, Acl> acls, List<KengaGroup> groups) {
//
        List<KengaAclTableRecordIdentity> parents = []

        kengaAclTableRecordIdentityListMap.each { aclObjectIdentity, aclEntries ->
            createAcl acls, aclObjectIdentity, aclEntries
        }

        parents
    }
}
