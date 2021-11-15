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

    changeSet(author: "Kakama Victor (generated)", id: "1633101778532-7") {
        createTable(tableName: "user") {
            column(name: "id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "userPK")
            }

            column(name: "date_created", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "password_expired", type: "BIT") {
                constraints(nullable: "false")
            }

            column(name: "username", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "last_updated", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "account_locked", type: "BIT") {
                constraints(nullable: "false")
            }

            column(name: "password", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "account_expired", type: "BIT") {
                constraints(nullable: "false")
            }

            column(name: "enabled", type: "BIT") {
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

    changeSet(author: "Bryan (generated)", id: "1633107920236-1") {
        createTable(tableName: "choice_option") {
            column(name: "id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "choice_optionPK")
            }

            column(name: "choice_id", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "form_setting_id", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "text", type: "LONGTEXT") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "Bryan (generated)", id: "1633107920236-2") {
        createTable(tableName: "form") {
            column(name: "id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "formPK")
            }

            column(name: "date_created", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "oxd_id", type: "VARCHAR(255)")

            column(name: "last_updated", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "name", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "study_id", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "sync_mode", type: "BIT") {
                constraints(nullable: "false")
            }

            column(name: "enabled", type: "BIT") {
                constraints(nullable: "false")
            }

            column(name: "description", type: "VARCHAR(255)")

            column(name: "display_name", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "Bryan (generated)", id: "1633107920236-4") {
        createTable(tableName: "study") {
            column(name: "id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "studyPK")
            }

            column(name: "date_created", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "oxd_id", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "sync_to_metabase", type: "BIT") {
                constraints(nullable: "false")
            }

            column(name: "last_updated", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "archive_study", type: "BIT") {
                constraints(nullable: "false")
            }

            column(name: "name", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "sync_mode", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "Bryan (generated)", id: "1633713117909-3") {
        createTable(tableName: "form_setting") {
            column(name: "id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "form_settingPK")
            }

            column(name: "question_text", type: "LONGTEXT")

            column(name: "date_created", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "last_updated", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "type_of_question", type: "VARCHAR(12)") {
                constraints(nullable: "false")
            }

            column(name: "parent_question", type: "VARCHAR(255)")

            column(name: "filter_by_text", type: "BIT") {
                constraints(nullable: "false")
            }

            column(name: "xform_type", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "display_name", type: "LONGTEXT")

            column(name: "form_id", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "order_of_display_in_table", type: "INT") {
                constraints(nullable: "false")
            }

            column(name: "view_on_map", type: "BIT") {
                constraints(nullable: "false")
            }

            column(name: "field", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "add_to_filter", type: "BIT") {
                constraints(nullable: "false")
            }

            column(name: "view_in_table", type: "BIT") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "Bryan (generated)", id: "1633107920236-5") {
        addForeignKeyConstraint(baseColumnNames: "form_setting_id", baseTableName: "choice_option", constraintName: "FK6ulbwgetjfe77f1qg84bxm0qx", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "form_setting", validate: "true")
    }

    changeSet(author: "Bryan (generated)", id: "1633713117909-17") {
        addForeignKeyConstraint(baseColumnNames: "form_id", baseTableName: "form_setting", constraintName: "FKiy86i2kxa61thdtihfuat58gs", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "form", validate: "true")
    }

    changeSet(author: "Bryan (generated)", id: "1633107920236-7") {
        addForeignKeyConstraint(baseColumnNames: "study_id", baseTableName: "form", constraintName: "FKl3mw5v1w4i5goeqd42v88srw3", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "study", validate: "true")
    }

    changeSet(author: "Bryan (generated)", id: "1633595744454-1") {
        createTable(tableName: "task_def") {
            column(name: "id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "task_defPK")
            }

            column(name: "date_created", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "start_on_startup", type: "BIT") {
                constraints(nullable: "false")
            }

            column(name: "last_updated", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "name", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "extra_params", type: "VARCHAR(255)")

            column(name: "cron_expression", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "description", type: "VARCHAR(255)")

            column(name: "task_class", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "Bryan (generated)", id: "1633595744454-2") {
        addUniqueConstraint(columnNames: "name", constraintName: "UC_TASK_DEFNAME_COL", tableName: "task_def")
    }

    changeSet(author: "LENOVO (generated)", id: "1634280728497-1") {
        addColumn(tableName: "form") {
            column(name: "central_id", type: "varchar(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "LENOVO (generated)", id: "1634280728497-2") {
        addColumn(tableName: "study") {
            column(name: "central_id", type: "varchar(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "LENOVO (generated)", id: "1634280728497-3") {
        dropColumn(columnName: "oxd_id", tableName: "form")
    }

    changeSet(author: "LENOVO (generated)", id: "1634280728497-4") {
        dropColumn(columnName: "oxd_id", tableName: "study")
    }

    changeSet(author: "Bryan (generated)", id: "1636026717745-1") {
        createTable(tableName: "group") {
            column(name: "id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "groupPK")
            }

            column(name: "date_created", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "last_updated", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "name", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "Bryan (generated)", id: "1636026717745-2") {
        createTable(tableName: "user_form") {
            column(name: "id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "user_formPK")
            }

            column(name: "form_id", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "date_created", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "last_updated", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "user_id", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "Bryan (generated)", id: "1636026717745-3") {
        createTable(tableName: "user_group") {
            column(name: "id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "user_groupPK")
            }

            column(name: "date_created", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "last_updated", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "user_id", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "group_id", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "group_role", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "Bryan (generated)", id: "1636026717745-4") {
        createTable(tableName: "user_study") {
            column(name: "id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "user_studyPK")
            }

            column(name: "date_created", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "last_updated", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "user_id", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "study_id", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "Bryan (generated)", id: "1636026717745-5") {
        addUniqueConstraint(columnNames: "name", constraintName: "UC_GROUPNAME_COL", tableName: "group")
    }

    changeSet(author: "Bryan (generated)", id: "1636026717745-6") {
        addUniqueConstraint(columnNames: "group_id, user_id", constraintName: "UK30e727c77fe15a65e4252a73b988", tableName: "user_group")
    }

    changeSet(author: "Bryan (generated)", id: "1636026717745-7") {
        addUniqueConstraint(columnNames: "study_id, user_id", constraintName: "UK9ecfee57007fc93135c5b06bf23a", tableName: "user_study")
    }

    changeSet(author: "Bryan (generated)", id: "1636026717745-8") {
        addUniqueConstraint(columnNames: "form_id, user_id", constraintName: "UKd512f11de5e919c52773dbc40494", tableName: "user_form")
    }

    changeSet(author: "Bryan (generated)", id: "1636026717745-9") {
        addForeignKeyConstraint(baseColumnNames: "user_id", baseTableName: "user_group", constraintName: "FK1c1dsw3q36679vaiqwvtv36a6", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "user", validate: "true")
    }

    changeSet(author: "Bryan (generated)", id: "1636026717745-10") {
        addForeignKeyConstraint(baseColumnNames: "study_id", baseTableName: "user_study", constraintName: "FK8g3qtmfhqft80t854j2n2gawm", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "study", validate: "true")
    }

    changeSet(author: "Bryan (generated)", id: "1636026717745-11") {
        addForeignKeyConstraint(baseColumnNames: "form_id", baseTableName: "user_form", constraintName: "FKet5bou1rejvasjlchtk95m0f", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "form", validate: "true")
    }

    changeSet(author: "Bryan (generated)", id: "1636026717745-12") {
        addForeignKeyConstraint(baseColumnNames: "user_id", baseTableName: "user_study", constraintName: "FKguhhymf5vvsah78agbjdgc3jp", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "user", validate: "true")
    }

    changeSet(author: "Bryan (generated)", id: "1636026717745-13") {
        addForeignKeyConstraint(baseColumnNames: "group_id", baseTableName: "user_group", constraintName: "FKjonf4pqux3h1e687sd18dhcnj", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "group", validate: "true")
    }

    changeSet(author: "Bryan (generated)", id: "1636026717745-14") {
        addForeignKeyConstraint(baseColumnNames: "user_id", baseTableName: "user_form", constraintName: "FKm04eqjlt7jll97dnmhk01dsh8", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "user", validate: "true")
    }

}
