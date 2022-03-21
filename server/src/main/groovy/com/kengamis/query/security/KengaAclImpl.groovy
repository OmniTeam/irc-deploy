package com.kengamis.query.security

import com.kengamis.acl.KengaAclTableRecordIdentity
import com.kengamis.acl.KengaGroupAclEntry
import org.springframework.security.acls.model.AccessControlEntry
import org.springframework.security.acls.model.Acl
import org.springframework.security.acls.model.NotFoundException
import org.springframework.security.acls.model.ObjectIdentity
import org.springframework.security.acls.model.Permission
import org.springframework.security.acls.model.Sid
import org.springframework.security.acls.model.UnloadedSidException

class KengaAclImpl implements Acl{
    KengaAclTableRecordIdentity kengaAclTableRecordIdentity
    List<KengaGroupAclEntry> entries
    @Override
    List<AccessControlEntry> getEntries() {
        return null
    }

    @Override
    ObjectIdentity getObjectIdentity() {
        return null
    }

    @Override
    Sid getOwner() {
        return null
    }

    @Override
    Acl getParentAcl() {
        return null
    }

    @Override
    boolean isEntriesInheriting() {
        return false
    }

    @Override
    boolean isGranted(List<Permission> list, List<Sid> list1, boolean b) throws NotFoundException, UnloadedSidException {
        return false
    }

    @Override
    boolean isSidLoaded(List<Sid> list) {
        return false
    }
}
