databaseChangeLog = {
    changeSet(author: "Bryan (generated)", id: "1638949600872-1") {
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

    changeSet(author: "Bryan (generated)", id: "1638949600872-2") {
        createTable(tableName: "form") {
            column(name: "id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "formPK")
            }

            column(name: "date_created", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "last_updated", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "study_id", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "central_id", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "display_name", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "name", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "sync_mode", type: "BIT") {
                constraints(nullable: "false")
            }

            column(name: "enabled", type: "BIT") {
                constraints(nullable: "false")
            }

            column(name: "description", type: "VARCHAR(255)")
        }
    }

    changeSet(author: "Bryan (generated)", id: "1638949600872-3") {
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

    changeSet(author: "Bryan (generated)", id: "1638949600872-4") {
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

    changeSet(author: "Bryan (generated)", id: "1638949600872-5") {
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

    changeSet(author: "Bryan (generated)", id: "1638949600872-6") {
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

    changeSet(author: "Bryan (generated)", id: "1638949600872-7") {
        createTable(tableName: "study") {
            column(name: "id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "studyPK")
            }

            column(name: "date_created", type: "datetime") {
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

            column(name: "central_id", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "Bryan (generated)", id: "1638949600872-8") {
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

    changeSet(author: "Bryan (generated)", id: "1638949600872-9") {
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

            column(name: "last_updated", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "account_expired", type: "BIT") {
                constraints(nullable: "false")
            }

            column(name: "names", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "username", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "account_locked", type: "BIT") {
                constraints(nullable: "false")
            }

            column(name: "password", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "enabled", type: "BIT") {
                constraints(nullable: "false")
            }

            column(name: "email", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "Bryan (generated)", id: "1638949600872-10") {
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

    changeSet(author: "Bryan (generated)", id: "1638949600872-11") {
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

    changeSet(author: "Bryan (generated)", id: "1638949600872-12") {
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

    changeSet(author: "Bryan (generated)", id: "1638949600872-13") {
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

    changeSet(author: "Bryan (generated)", id: "1638949600872-14") {
        addUniqueConstraint(columnNames: "name", constraintName: "UC_GROUPNAME_COL", tableName: "group")
    }

    changeSet(author: "Bryan (generated)", id: "1638949600872-15") {
        addUniqueConstraint(columnNames: "authority", constraintName: "UC_ROLEAUTHORITY_COL", tableName: "role")
    }

    changeSet(author: "Bryan (generated)", id: "1638949600872-16") {
        addUniqueConstraint(columnNames: "name", constraintName: "UC_TASK_DEFNAME_COL", tableName: "task_def")
    }

    changeSet(author: "Bryan (generated)", id: "1638949600872-17") {
        addUniqueConstraint(columnNames: "username", constraintName: "UC_USERUSERNAME_COL", tableName: "user")
    }

    changeSet(author: "Bryan (generated)", id: "1638949600872-18") {
        addUniqueConstraint(columnNames: "group_id, user_id", constraintName: "UK30e727c77fe15a65e4252a73b988", tableName: "user_group")
    }

    changeSet(author: "Bryan (generated)", id: "1638949600872-19") {
        addUniqueConstraint(columnNames: "study_id, user_id", constraintName: "UK9ecfee57007fc93135c5b06bf23a", tableName: "user_study")
    }

    changeSet(author: "Bryan (generated)", id: "1638949600872-20") {
        addUniqueConstraint(columnNames: "form_id, user_id", constraintName: "UKd512f11de5e919c52773dbc40494", tableName: "user_form")
    }

    changeSet(author: "Bryan (generated)", id: "1638949600872-21") {
        addUniqueConstraint(columnNames: "http_method, url", constraintName: "UKf721bf1f2340334e273dd57aedcb", tableName: "request_map")
    }

    changeSet(author: "Bryan (generated)", id: "1638949600872-22") {
        addForeignKeyConstraint(baseColumnNames: "user_id", baseTableName: "user_group", constraintName: "FK1c1dsw3q36679vaiqwvtv36a6", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "user", validate: "true")
    }

    changeSet(author: "Bryan (generated)", id: "1638949600872-23") {
        addForeignKeyConstraint(baseColumnNames: "form_setting_id", baseTableName: "choice_option", constraintName: "FK6ulbwgetjfe77f1qg84bxm0qx", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "form_setting", validate: "true")
    }

    changeSet(author: "Bryan (generated)", id: "1638949600872-24") {
        addForeignKeyConstraint(baseColumnNames: "user_id", baseTableName: "user_role", constraintName: "FK859n2jvi8ivhui0rl0esws6o", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "user", validate: "true")
    }

    changeSet(author: "Bryan (generated)", id: "1638949600872-25") {
        addForeignKeyConstraint(baseColumnNames: "study_id", baseTableName: "user_study", constraintName: "FK8g3qtmfhqft80t854j2n2gawm", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "study", validate: "true")
    }

    changeSet(author: "Bryan (generated)", id: "1638949600872-26") {
        addForeignKeyConstraint(baseColumnNames: "role_id", baseTableName: "user_role", constraintName: "FKa68196081fvovjhkek5m97n3y", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "role", validate: "true")
    }

    changeSet(author: "Bryan (generated)", id: "1638949600872-27") {
        addForeignKeyConstraint(baseColumnNames: "form_id", baseTableName: "user_form", constraintName: "FKet5bou1rejvasjlchtk95m0f", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "form", validate: "true")
    }

    changeSet(author: "Bryan (generated)", id: "1638949600872-28") {
        addForeignKeyConstraint(baseColumnNames: "user_id", baseTableName: "user_study", constraintName: "FKguhhymf5vvsah78agbjdgc3jp", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "user", validate: "true")
    }

    changeSet(author: "Bryan (generated)", id: "1638949600872-29") {
        addForeignKeyConstraint(baseColumnNames: "form_id", baseTableName: "form_setting", constraintName: "FKiy86i2kxa61thdtihfuat58gs", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "form", validate: "true")
    }

    changeSet(author: "Bryan (generated)", id: "1638949600872-30") {
        addForeignKeyConstraint(baseColumnNames: "group_id", baseTableName: "user_group", constraintName: "FKjonf4pqux3h1e687sd18dhcnj", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "group", validate: "true")
    }

    changeSet(author: "Bryan (generated)", id: "1638949600872-31") {
        addForeignKeyConstraint(baseColumnNames: "study_id", baseTableName: "form", constraintName: "FKl3mw5v1w4i5goeqd42v88srw3", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "study", validate: "true")
    }

    changeSet(author: "Bryan (generated)", id: "1638949600872-32") {
        addForeignKeyConstraint(baseColumnNames: "user_id", baseTableName: "user_form", constraintName: "FKm04eqjlt7jll97dnmhk01dsh8", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "user", validate: "true")
    }

    changeSet(author: "Bryan (generated)", id: "1639378731012-1") {
        createTable(tableName: "entity_fields") {
            column(name: "id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "entity_fieldsPK")
            }

            column(name: "sql_data_type", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "date_created", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "last_updated", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "display_name", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "data_type", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "field_type", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "mandatory", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "field_name", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "order_of_display", type: "INT") {
                constraints(nullable: "false")
            }

            column(name: "filter_order", type: "INT") {
                constraints(nullable: "false")
            }

            column(name: "mis_entity_id", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "Bryan (generated)", id: "1639378731012-2") {
        createTable(tableName: "entity_form") {
            column(name: "id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "entity_formPK")
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

            column(name: "mis_entity_id", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "Bryan (generated)", id: "1639378731012-3") {
        createTable(tableName: "entity_form_field_map") {
            column(name: "id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "entity_form_field_mapPK")
            }

            column(name: "date_created", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "entity_field", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "last_updated", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "entity_form_id", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "form_field", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "Bryan (generated)", id: "1639378731012-4") {
        createTable(tableName: "mis_entity") {
            column(name: "id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "mis_entityPK")
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

            column(name: "table_name", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "ignore_user_context", type: "BIT") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "Bryan (generated)", id: "1639378731012-5") {
        addForeignKeyConstraint(baseColumnNames: "entity_form_id", baseTableName: "entity_form_field_map", constraintName: "FKbfltmac8n7vlvdc2f2fh17mi3", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "entity_form", validate: "true")
    }

    changeSet(author: "Bryan (generated)", id: "1639378731012-6") {
        addForeignKeyConstraint(baseColumnNames: "mis_entity_id", baseTableName: "entity_fields", constraintName: "FKl2rp5prj1b840d9rbmkmp8f5w", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "mis_entity", validate: "true")
    }

    changeSet(author: "Bryan (generated)", id: "1639378731012-7") {
        addForeignKeyConstraint(baseColumnNames: "mis_entity_id", baseTableName: "entity_form", constraintName: "FKqno4734ea6k0mqcgj2fqnppoq", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "mis_entity", validate: "true")
    }

    changeSet(author: "Bryan (generated)", id: "1639378731012-8") {
        addForeignKeyConstraint(baseColumnNames: "form_id", baseTableName: "entity_form", constraintName: "FKso5r8nh2ph67ufqlmdyhe7yjq", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "form", validate: "true")
    }

    changeSet(author: "Bryan (generated)", id: "1641206080681-1") {
        addColumn(tableName: "entity_form_field_map") {
            column(name: "entity_field_type", type: "varchar(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "Bryan (generated)", id: "1641206080681-2") {
        addColumn(tableName: "entity_form_field_map") {
            column(name: "form_field_type", type: "varchar(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "Bryan (generated)", id: "1641561324661-1") {
        createTable(tableName: "entity_view") {
            column(name: "id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "entity_viewPK")
            }

            column(name: "view_query", type: "LONGTEXT")

            column(name: "date_created", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "last_updated", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "name", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "table_name", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "ignore_user_context", type: "BIT") {
                constraints(nullable: "false")
            }

            column(name: "description", type: "VARCHAR(255)")

            column(name: "mis_entity_id", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "Bryan (generated)", id: "1641561324661-2") {
        createTable(tableName: "entity_view_fields") {
            column(name: "id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "entity_view_fieldsPK")
            }

            column(name: "datatype", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "date_created", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "last_updated", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "field_type", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "entity_view_id", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "name", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "order_of_display", type: "INT") {
                constraints(nullable: "false")
            }

            column(name: "filter_order", type: "INT") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "Bryan (generated)", id: "1641561324661-3") {
        addForeignKeyConstraint(baseColumnNames: "mis_entity_id", baseTableName: "entity_view", constraintName: "FK1ntgwta5w3svsh0yhy2f035xk", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "mis_entity", validate: "true")
    }

    changeSet(author: "Bryan (generated)", id: "1641561324661-4") {
        addForeignKeyConstraint(baseColumnNames: "entity_view_id", baseTableName: "entity_view_fields", constraintName: "FKio7hqe8r4oyua9qfs7g5sbmar", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "entity_view", validate: "true")
    }

    changeSet(author: "BrunoJay (generated)", id: "1641542082472-1") {
        createTable(tableName: "task_list") {
            column(name: "id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "task_listPK")
            }

            column(name: "user_id", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "date_created", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "group_id", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "output_variables", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "process_def_key", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "input_variables", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "last_updated", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "synced", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "form_id", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "task_name", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "process_instance_id", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "status", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "task_definition_key", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "BrunoJay (generated)", id: "1641553977460-1") {
        addColumn(tableName: "task_list") {
            column(name: "task_id", type: "varchar(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "BrunoJay (generated)", id: "1641554948339-1") {
        dropNotNullConstraint(columnDataType: "varchar(255)", columnName: "form_id", tableName: "task_list")
    }

    changeSet(author: "Bryan (generated)", id: "1644499803165-1") {
        createTable(tableName: "tag") {
            column(name: "id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "tagPK")
            }

            column(name: "tag_type_id", type: "VARCHAR(255)") {
                constraints(nullable: "false")
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

    changeSet(author: "Bryan (generated)", id: "1644499803165-2") {
        createTable(tableName: "tag_type") {
            column(name: "id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "tag_typePK")
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

    changeSet(author: "Bryan (generated)", id: "1644499803165-3") {
        addForeignKeyConstraint(baseColumnNames: "tag_type_id", baseTableName: "tag", constraintName: "FK4dal6a59cl5t8omhsi2yrtk0g", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "tag_type", validate: "true")
    }


}
