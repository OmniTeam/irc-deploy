databaseChangeLog = {

    changeSet(author: "Kakama Victor (generated)", id: "1632944057028-1") {
        createTable(tableName: "request_map") {
            column(name: "id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "request_mapPK")
            }

            column(name: "http_method", type: "VARCHAR(255)")

            column(name: "config_attribute", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "url", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "Kakama Victor (generated)", id: "1632944057028-2") {
        createTable(tableName: "role") {
            column(name: "id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "rolePK")
            }

            column(name: "date_created", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "last_updated", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "authority", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "Kakama Victor (generated)", id: "1632944057028-3") {
        createTable(tableName: "user") {
            column(name: "id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "userPK")
            }

            column(name: "otp_channel", type: "VARCHAR(255)")

            column(name: "is_active", type: "BOOLEAN") {
                constraints(nullable: "false")
            }

            column(name: "date_created", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "first_name", type: "VARCHAR(255)")

            column(name: "password_expired", type: "BOOLEAN") {
                constraints(nullable: "false")
            }

            column(name: "referral_code", type: "VARCHAR(255)")

            column(name: "last_updated", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "middle_name", type: "VARCHAR(255)")

            column(name: "ussd_updated", type: "BOOLEAN") {
                constraints(nullable: "false")
            }

            column(name: "gender", type: "VARCHAR(255)")

            column(name: "sent_verify_profile_email", type: "BOOLEAN")

            column(name: "account_expired", type: "BOOLEAN") {
                constraints(nullable: "false")
            }

            column(defaultValue: "none", name: "social_provider", type: "VARCHAR(255)")

            column(name: "firebase_token", type: "VARCHAR(255)")

            column(name: "password_ref", type: "VARCHAR(255)")

            column(name: "source", type: "VARCHAR(255)")

            column(name: "telephone", type: "VARCHAR(255)")

            column(name: "country_code", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "username", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "ref_id", type: "VARCHAR(255)")

            column(name: "ussd_phone_active", type: "BOOLEAN")

            column(name: "account_locked", type: "BOOLEAN") {
                constraints(nullable: "false")
            }

            column(name: "password", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "ussd_referral", type: "BOOLEAN")

            column(name: "profile_phone", type: "VARCHAR(255)")

            column(name: "last_name", type: "VARCHAR(255)")

            column(name: "kyc_status", type: "VARCHAR(255)")

            column(name: "enabled", type: "BOOLEAN") {
                constraints(nullable: "false")
            }

            column(name: "account_verified", type: "BOOLEAN") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "Kakama Victor (generated)", id: "1632944057028-4") {
        createTable(tableName: "user_role") {
            column(name: "user_id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "user_rolePK")
            }

            column(name: "role_id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "user_rolePK")
            }

            column(name: "date_created", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "last_updated", type: "datetime") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "Kakama Victor (generated)", id: "1632944057028-5") {
        addUniqueConstraint(columnNames: "authority", constraintName: "UC_ROLEAUTHORITY_COL", tableName: "role")
    }

    changeSet(author: "Kakama Victor (generated)", id: "1632944057028-6") {
        addUniqueConstraint(columnNames: "profile_phone", constraintName: "UC_USERPROFILE_PHONE_COL", tableName: "user")
    }

    changeSet(author: "Kakama Victor (generated)", id: "1632944057028-7") {
        addUniqueConstraint(columnNames: "referral_code", constraintName: "UC_USERREFERRAL_CODE_COL", tableName: "user")
    }

    changeSet(author: "Kakama Victor (generated)", id: "1632944057028-8") {
        addUniqueConstraint(columnNames: "ref_id", constraintName: "UC_USERREF_ID_COL", tableName: "user")
    }

    changeSet(author: "Kakama Victor (generated)", id: "1632944057028-9") {
        addUniqueConstraint(columnNames: "username", constraintName: "UC_USERUSERNAME_COL", tableName: "user")
    }

    changeSet(author: "Kakama Victor (generated)", id: "1632944057028-10") {
        addUniqueConstraint(columnNames: "http_method, url", constraintName: "UKf721bf1f2340334e273dd57aedcb", tableName: "request_map")
    }

    changeSet(author: "Kakama Victor (generated)", id: "1632944057028-11") {
        addForeignKeyConstraint(baseColumnNames: "user_id", baseTableName: "user_role", constraintName: "FK859n2jvi8ivhui0rl0esws6o", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "user", validate: "true")
    }

    changeSet(author: "Kakama Victor (generated)", id: "1632944057028-12") {
        addForeignKeyConstraint(baseColumnNames: "role_id", baseTableName: "user_role", constraintName: "FKa68196081fvovjhkek5m97n3y", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "role", validate: "true")
    }

}
