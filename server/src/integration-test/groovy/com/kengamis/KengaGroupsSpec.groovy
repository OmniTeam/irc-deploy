package com.kengamis

import com.kengamis.acl.KengaAclTableRecordIdentity
import com.kengamis.acl.KengaDataTable
import com.kengamis.acl.KengaGroupAclEntry
import com.kengamis.query.security.Permission
import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.authentication.TestingAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import spock.lang.Specification

@Integration
@Rollback
class KengaGroupsSpec extends Specification {

    @Autowired
    KengaGroupsService kengaGroupsService

    def houseHoldRecords = []

    def setup() {
    }

    def cleanup() {
    }

    void "test filtering returns correct records according to group"() {
        given:
            setupData()
            authenticate('victor','manager',true)
        expect:"fix me"
            kengaGroupsService.postFilter(houseHoldRecords,Permission.READ).size() == 10
    }

    void "test filtering returns correct records according to group with limited entries"() {
        given:
        setupData()
        authenticate('brian','uganda',true)
        expect:"return limited data since this user has limited entries to uganda"
        kengaGroupsService.postFilter(houseHoldRecords,Permission.READ).size() == 4
    }

    void "test that user has correct write permissions"() {
        given:
            setupData()
            authenticate('brian','uganda',true)
        expect:"return only records with write permissions"
            kengaGroupsService.postFilter(houseHoldRecords,Permission.WRITE).size() == 1
    }

    void "test that user has correct write permissions for crvpf"() {
        given:
        setupData()
        authenticate('victor','crvpf',true)
        expect:"return only records with write permissions"
        kengaGroupsService.postFilter(houseHoldRecords,Permission.WRITE).size() == 0
    }

    void setupData() {
        def crvpfstaff = new KengaGroup(name: 'Crvpf Staff')
        crvpfstaff.save(flush: true)

        def uganda = new KengaGroup(name: 'Uganda')
        uganda.save(flush: true)

        def kenya = new KengaGroup(name: 'Kenya')
        kenya.save(flush: true)

        def ethiopia = new KengaGroup(name: 'Ethiopia')
        ethiopia.save(flush: true)

        def partner1 = new KengaGroup(name: 'Partner 1')
        partner1.save(flush: true)

        def partner2 = new KengaGroup(name: 'Partner 2')
        partner2.save(flush: true)

        def partner3 = new KengaGroup(name: 'Partner 3')
        partner3.save(flush: true)

        def partner4 = new KengaGroup(name: 'Partner 4')
        partner4.save(flush: true)


        def victor = new User(username: 'victor', password: 'password')
        victor.save(flush: true)

        def brian = new User(username: 'brian', password: 'password')
        brian.save(flush: true)

        def userGroup1 = new KengaUserGroup(user: victor, kengaGroup: crvpfstaff)
        userGroup1.save(flush: true)
        //usergroup for brian
        def userGroup2 = new KengaUserGroup(user: brian, kengaGroup: uganda)
        userGroup2.save(flush: true)

        def houseHoldTable = new KengaDataTable(tableName: 'house_hold_table')
        houseHoldTable.save(flush: true)

        houseHoldRecords = []
        houseHoldRecords << ['id': 'ab','household name':'kakabouy', 'country':'uganda']
        houseHoldRecords << ['id': 'cd','household name':'nahabwe', 'country':'uganda']
        houseHoldRecords << ['id': 'ef','household name':'joseph', 'country':'uganda']
        houseHoldRecords << ['id': 'gh','household name':'bruno', 'country':'uganda']
        houseHoldRecords << ['id': 'ij','household name':'joel', 'country':'Kenya']
        houseHoldRecords << ['id': 'kl','household name':'angel', 'country':'Kenya']
        houseHoldRecords << ['id': 'mn','household name':'cathy', 'country':'kenya']
        houseHoldRecords << ['id': 'op','household name':'peter', 'country':'ethiopia']
        houseHoldRecords << ['id': 'qr','household name':'crispas', 'country':'ethiopia']
        houseHoldRecords << ['id': 'st','household name':'marven', 'country':'uganda']


        def identity1 = new KengaAclTableRecordIdentity(kengaDataTable: houseHoldTable, dataTableRecordId: 'ab', kengaGroup: partner4)
        identity1.save(flush: true, failOnError:true)

        def identity2 = new KengaAclTableRecordIdentity(kengaDataTable: houseHoldTable, dataTableRecordId: 'cd', kengaGroup: partner4)
        identity2.save(flush: true)

        def identity3 = new KengaAclTableRecordIdentity(kengaDataTable: houseHoldTable, dataTableRecordId: 'ef', kengaGroup: partner4)
        identity3.save(flush: true)

        def identity4 = new KengaAclTableRecordIdentity(kengaDataTable: houseHoldTable, dataTableRecordId: 'gh', kengaGroup: partner4)
        identity4.save(flush: true)

        def identity5 = new KengaAclTableRecordIdentity(kengaDataTable: houseHoldTable, dataTableRecordId: 'ij', kengaGroup: partner4)
        identity5.save(flush: true)

        def identity6 = new KengaAclTableRecordIdentity(kengaDataTable: houseHoldTable, dataTableRecordId: 'kl', kengaGroup: partner4)
        identity6.save(flush: true)

        def identity7 = new KengaAclTableRecordIdentity(kengaDataTable: houseHoldTable, dataTableRecordId: 'mn', kengaGroup: partner4)
        identity7.save(flush: true)

        def identity8 = new KengaAclTableRecordIdentity(kengaDataTable: houseHoldTable, dataTableRecordId: 'op', kengaGroup: partner4)
        identity8.save(flush: true)

        def identity9 = new KengaAclTableRecordIdentity(kengaDataTable: houseHoldTable, dataTableRecordId: 'qr', kengaGroup: partner4)
        identity9.save(flush: true)

        def identity10 = new KengaAclTableRecordIdentity(kengaDataTable: houseHoldTable, dataTableRecordId: 'st', kengaGroup: partner4)
        identity10.save(flush: true)

        //create acls
        new KengaGroupAclEntry(kengaAclTableRecordIdentity: identity1,kengaGroup: crvpfstaff, mask: 1).save(flush: true)
        new KengaGroupAclEntry(kengaAclTableRecordIdentity: identity2,kengaGroup: crvpfstaff, mask: 1).save(flush: true)
        new KengaGroupAclEntry(kengaAclTableRecordIdentity: identity3,kengaGroup: crvpfstaff, mask: 1).save(flush: true)
        new KengaGroupAclEntry(kengaAclTableRecordIdentity: identity4,kengaGroup: crvpfstaff, mask: 1).save(flush: true)
        new KengaGroupAclEntry(kengaAclTableRecordIdentity: identity5,kengaGroup: crvpfstaff, mask: 1).save(flush: true)
        new KengaGroupAclEntry(kengaAclTableRecordIdentity: identity6,kengaGroup: crvpfstaff, mask: 1).save(flush: true)
        new KengaGroupAclEntry(kengaAclTableRecordIdentity: identity7,kengaGroup: crvpfstaff, mask: 1).save(flush: true)
        new KengaGroupAclEntry(kengaAclTableRecordIdentity: identity8,kengaGroup: crvpfstaff, mask: 1).save(flush: true)
        new KengaGroupAclEntry(kengaAclTableRecordIdentity: identity9,kengaGroup: crvpfstaff, mask: 1).save(flush: true)
        new KengaGroupAclEntry(kengaAclTableRecordIdentity: identity10,kengaGroup: crvpfstaff, mask: 1).save(flush: true)

        // acls for a uganda group
        new KengaGroupAclEntry(kengaAclTableRecordIdentity: identity1,kengaGroup: uganda, mask: 1).save(flush: true)
        new KengaGroupAclEntry(kengaAclTableRecordIdentity: identity2,kengaGroup: uganda, mask: 1).save(flush: true)
        new KengaGroupAclEntry(kengaAclTableRecordIdentity: identity3,kengaGroup: uganda, mask: 1).save(flush: true)
        new KengaGroupAclEntry(kengaAclTableRecordIdentity: identity10,kengaGroup: uganda, mask: 1).save(flush: true)
        new KengaGroupAclEntry(kengaAclTableRecordIdentity: identity10,kengaGroup: uganda, mask: 2).save(flush: true)
    }

    protected Authentication authenticate(String username = 'username', String role, boolean makeCurrent = true) {
        def authorities = [new SimpleGrantedAuthority(role)]
        def principal = new org.springframework.security.core.userdetails.User(username, 'password', true, true, true, true, authorities)
        Authentication authentication = new TestingAuthenticationToken(principal, 'password', authorities)
        authentication.authenticated = true
        if (makeCurrent) {
            SecurityContextHolder.context.authentication = authentication
        }
        authentication
    }
}
