package com.kengamis.query.security

import com.kengamis.KengaGroup
import com.kengamis.KengaUserGroup
import com.kengamis.acl.KengaAclTableRecordIdentity
import com.kengamis.acl.KengaDataTable
import com.kengamis.acl.KengaGroupAclEntry
import grails.plugin.springsecurity.acl.AclObjectIdentity
import groovy.util.logging.Slf4j
import org.springframework.security.acls.domain.DefaultPermissionFactory
import org.springframework.security.acls.domain.PermissionFactory
import org.springframework.security.acls.model.Acl
import org.springframework.security.acls.model.MutableAcl
import org.springframework.security.acls.model.NotFoundException
import org.springframework.security.core.Authentication
import org.springframework.util.Assert

@Slf4j
class KengaGroupPermissionEvaluator implements IKengaGroupPermissionEvaluator {

    KengaGroupPermissionEvaluator() {
    }

    private PermissionFactory permissionFactory = new DefaultPermissionFactory()

    @Override
    boolean hasPermission(Authentication authentication, Object dataObject, Permission permission, String tableName = "") {
        if (dataObject == null) {
            return false
        }
        KengaAclTableRecordIdentity recordIdentity = getRecordIdentity(dataObject,tableName)
        return checkPermission(authentication, recordIdentity, permission)
    }

    KengaAclTableRecordIdentity getRecordIdentity(Object dataObject, String tableName = "") {

        def dataRecordId = ""
        if(!tableName.isEmpty()){
            def kengaDataTable = KengaDataTable.findByTableName(tableName)
            if(kengaDataTable){
                dataRecordId = dataObject."$kengaDataTable.idLabel"
            }
        }else{
            dataRecordId = dataObject?.id
        }
        def query = KengaAclTableRecordIdentity
                .where { dataTableRecordId == dataRecordId }
        KengaAclTableRecordIdentity tableRecordIdentity = query.find()
        return tableRecordIdentity
    }

    private boolean checkPermission(Authentication authentication, KengaAclTableRecordIdentity recordIdentity, Permission permission) {
        //get groups applicable to the principle
        List<KengaGroup> groups = retrieveKengaGroups(authentication)
        log.debug("Checking permission: ${permission} for object:${recordIdentity}")

        try {
//            look for acls only for groups we are interested in
            def acls = findAcls(recordIdentity)
            if(isGranted(acls,permission,groups)){
                return true
            }
        } catch (NotFoundException exception) {
            log.debug("Returning false, no acls apply for this group")
        }
        return false

    }

    List<KengaGroup> retrieveKengaGroups(Authentication authentication) {
        def kengaGroups = KengaUserGroup.findAllGroups(authentication.principal.username)
        return kengaGroups
    }

    List<Permission> resolvePermission(Object permission) {
        if (permission instanceof Integer) {
//            TODO check whether it builds correctly
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

    protected List<KengaGroupAclEntry> findAcls(KengaAclTableRecordIdentity tableRecordIdentity) {
        List<KengaGroupAclEntry> entries
        if(tableRecordIdentity) {
            entries = KengaGroupAclEntry.withCriteria {
                'eq'('kengaAclTableRecordIdentity', tableRecordIdentity)
            }
        }

        return entries
    }

    /**
     * checks if any of the groups has access to the record for permission
     * @param entries
     * @param permission
     * @param groups
     * @return true is permission is granted and false otherwisee
     */
    protected boolean isGranted(List<KengaGroupAclEntry> entries, Permission permission, List<KengaGroup> groups) {
        if(permission == Permission.ADMINISTRATION) return true
        for(KengaGroup group: groups){
            for(KengaGroupAclEntry entry: entries) {
                if(entry.kengaGroup == group && Permission.hasPermission(entry.mask,permission)){
                    return true
                }
            }
        }
        return false
    }
}
