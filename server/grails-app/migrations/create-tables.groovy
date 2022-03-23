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

    changeSet(author: "BrunoJay (generated)", id: "1644910564036-1") {
        createTable(tableName: "report_form") {
            column(name: "id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "report_formPK")
            }

            column(name: "process_id", type: "VARCHAR(255)") {
                constraints(nullable: "false")
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

            column(name: "report_values", type: "text") {
                constraints(nullable: "false")
            }

            column(name: "last_updated", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "task_id", type: "VARCHAR(255)") {
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

    changeSet(author: "BrunoJay (generated)", id: "1644910564036-2") {
        createTable(tableName: "report_form_comments") {
            column(name: "id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "report_form_commentsPK")
            }

            column(name: "process_id", type: "VARCHAR(255)") {
                constraints(nullable: "false")
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

            column(name: "task_id", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "content", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "children", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "task_definition_key", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "BrunoJay (generated)", id: "1644910564036-3") {
        createTable(tableName: "report_form_files") {
            column(name: "id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "report_form_filesPK")
            }

            column(name: "process_id", type: "VARCHAR(255)") {
                constraints(nullable: "false")
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

            column(name: "path", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "name", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "task_id", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "task_definition_key", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "BrunoJay (generated)", id: "1644910564036-4") {
        createTable(tableName: "report_form_recommendations") {
            column(name: "id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "report_form_recommendationsPK")
            }

            column(name: "process_id", type: "VARCHAR(255)") {
                constraints(nullable: "false")
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

            column(name: "task_id", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "content", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "task_definition_key", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "Bryan (generated)", id: "1644824111661-1") {
        addColumn(tableName: "tag_type") {
            column(name: "mis_entity_id", type: "varchar(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "Bryan (generated)", id: "1644824111661-2") {
        addForeignKeyConstraint(baseColumnNames: "mis_entity_id", baseTableName: "tag_type", constraintName: "FK2yamjvvmhg3koumfynkxt9ail", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "mis_entity", validate: "true")
    }

    changeSet(author: "Bryan (generated)", id: "1644832502002-1") {
        addColumn(tableName: "mis_entity") {
            column(name: "enable_tagging", type: "bit") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "Bryan (generated)", id: "1644832502002-2") {
        addColumn(tableName: "mis_entity") {
            column(name: "prefix", type: "varchar(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "Bryan (generated)", id: "1644847113497-1") {
        addColumn(tableName: "mis_entity") {
            column(name: "prefix_increment_table", type: "varchar(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "Bryan (generated)", id: "1644911791342-1") {
        addColumn(tableName: "mis_entity") {
            column(name: "entity_tag_table", type: "varchar(255)")
        }
    }

    changeSet(author: "victorkakama (generated)", id: "1645511152009-1") {
        createTable(tableName: "acl_class") {
            column(autoIncrement: "true", name: "id", type: "BIGINT") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "acl_classPK")
            }

            column(name: "class", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "victorkakama (generated)", id: "1645511152009-2") {
        createTable(tableName: "acl_entry") {
            column(autoIncrement: "true", name: "id", type: "BIGINT") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "acl_entryPK")
            }

            column(name: "sid", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "audit_failure", type: "BIT") {
                constraints(nullable: "false")
            }

            column(name: "granting", type: "BIT") {
                constraints(nullable: "false")
            }

            column(name: "acl_object_identity", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "audit_success", type: "BIT") {
                constraints(nullable: "false")
            }

            column(name: "ace_order", type: "INT") {
                constraints(nullable: "false")
            }

            column(name: "mask", type: "INT") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "victorkakama (generated)", id: "1645511152009-3") {
        createTable(tableName: "acl_object_identity") {
            column(autoIncrement: "true", name: "id", type: "BIGINT") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "acl_object_identityPK")
            }

            column(name: "object_id_identity", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "entries_inheriting", type: "BIT") {
                constraints(nullable: "false")
            }

            column(name: "object_id_class", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "owner_sid", type: "BIGINT")

            column(name: "parent_object", type: "BIGINT")
        }
    }

    changeSet(author: "victorkakama (generated)", id: "1645511152009-4") {
        createTable(tableName: "acl_sid") {
            column(autoIncrement: "true", name: "id", type: "BIGINT") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "acl_sidPK")
            }

            column(name: "sid", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "principal", type: "BIT") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "victorkakama (generated)", id: "1645511152009-5") {
        addUniqueConstraint(columnNames: "class", constraintName: "UC_ACL_CLASSCLASS_COL", tableName: "acl_class")
    }

    changeSet(author: "victorkakama (generated)", id: "1645511152009-6") {
        addUniqueConstraint(columnNames: "sid, principal", constraintName: "UK1781b9a084dff171b580608b3640", tableName: "acl_sid")
    }

    changeSet(author: "victorkakama (generated)", id: "1645511152009-7") {
        addUniqueConstraint(columnNames: "object_id_class, object_id_identity", constraintName: "UK56103a82abb455394f8c97a95587", tableName: "acl_object_identity")
    }

    changeSet(author: "victorkakama (generated)", id: "1645511152009-8") {
        addUniqueConstraint(columnNames: "acl_object_identity, ace_order", constraintName: "UKce200ed06800e5a163c6ab6c0c85", tableName: "acl_entry")
    }

    changeSet(author: "victorkakama (generated)", id: "1645511152009-9") {
        addForeignKeyConstraint(baseColumnNames: "parent_object", baseTableName: "acl_object_identity", constraintName: "FK4soxn7uid8qxltqps8kewftx7", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "acl_object_identity", validate: "true")
    }

    changeSet(author: "victorkakama (generated)", id: "1645511152009-10") {
        addForeignKeyConstraint(baseColumnNames: "sid", baseTableName: "acl_entry", constraintName: "FK9r4mj8ewa904g3wivff0tb5b0", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "acl_sid", validate: "true")
    }

    changeSet(author: "victorkakama (generated)", id: "1645511152009-11") {
        addForeignKeyConstraint(baseColumnNames: "object_id_class", baseTableName: "acl_object_identity", constraintName: "FKc06nv93ck19el45a3g1p0e58w", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "acl_class", validate: "true")
    }

    changeSet(author: "victorkakama (generated)", id: "1645511152009-12") {
        addForeignKeyConstraint(baseColumnNames: "owner_sid", baseTableName: "acl_object_identity", constraintName: "FKikrbtok3aqlrp9wbq6slh9mcw", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "acl_sid", validate: "true")
    }

    changeSet(author: "victorkakama (generated)", id: "1645511152009-13") {
        addForeignKeyConstraint(baseColumnNames: "acl_object_identity", baseTableName: "acl_entry", constraintName: "FKl39t1oqikardwghegxe0wdcpt", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "acl_object_identity", validate: "true")
    }

    changeSet(author: "victorkakama (generated)", id: "1645697783843-2") {
        createTable(tableName: "kenga_group") {
            column(name: "id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "kenga_groupPK")
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

    changeSet(author: "victorkakama (generated)", id: "1645697783843-3") {
        addUniqueConstraint(columnNames: "name", constraintName: "UC_KENGA_GROUPNAME_COL", tableName: "kenga_group")
    }

    changeSet(author: "victorkakama (generated)", id: "1645697783843-4") {
        addForeignKeyConstraint(baseColumnNames: "group_id", baseTableName: "user_group", constraintName: "FKk2k4e53v15rb9374r2nu24rts", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "kenga_group", validate: "true")
    }

    changeSet(author: "victorkakama (generated)", id: "1645697783843-5") {
        dropForeignKeyConstraint(baseTableName: "user_group", constraintName: "FKjonf4pqux3h1e687sd18dhcnj")
    }
    changeSet(author: "victorkakama (generated)", id: "1645697783843-8") {
        dropUniqueConstraint(constraintName: "UC_GROUPNAME_COL", tableName: "group")
    }
    changeSet(author: "victorkakama (generated)", id: "1646033595933-1") {
        createTable(tableName: "kenga_group_role") {
            column(name: "kenga_group_id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "kenga_group_rolePK")
            }

            column(name: "role_id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "kenga_group_rolePK")
            }

            column(name: "date_created", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "last_updated", type: "datetime") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "victorkakama (generated)", id: "1646033595933-2") {
        addForeignKeyConstraint(baseColumnNames: "kenga_group_id", baseTableName: "kenga_group_role", constraintName: "FK6j6xb1j0i5wp1b50f7ff7f39u", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "kenga_group", validate: "true")
    }

    changeSet(author: "victorkakama (generated)", id: "1646033595933-3") {
        addForeignKeyConstraint(baseColumnNames: "role_id", baseTableName: "kenga_group_role", constraintName: "FK8fmsx15k5wgah0nxu3aojreiy", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "role", validate: "true")
    }

    changeSet(author: "victorkakama (generated)", id: "1646033595933-4") {
        dropTable(tableName: "group")
    }

    changeSet(author: "victorkakama (generated)", id: "1646033595933-5") {
        dropColumn(columnName: "group_role", tableName: "user_group")
    }

    changeSet(author: "victorkakama (generated)", id: "1646915942170-1") {
        createTable(tableName: "kenga_acl_table_record_identity") {
            column(autoIncrement: "true", name: "id", type: "BIGINT") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "kenga_acl_table_record_identityPK")
            }

            column(name: "data_table_record_id", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "kenga_data_table_id", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "kenga_group_id", type: "VARCHAR(255)")
        }
    }

    changeSet(author: "victorkakama (generated)", id: "1646915942170-2") {
        createTable(tableName: "kenga_data_table") {
            column(autoIncrement: "true", name: "id", type: "BIGINT") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "kenga_data_tablePK")
            }

            column(name: "table_name", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "victorkakama (generated)", id: "1646915942170-3") {
        createTable(tableName: "kenga_group_acl_entry") {
            column(autoIncrement: "true", name: "id", type: "BIGINT") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "kenga_group_acl_entryPK")
            }

            column(name: "kenga_acl_table_record_identity_id", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "kenga_group_id", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "ace_order", type: "INT") {
                constraints(nullable: "false")
            }

            column(name: "mask", type: "INT") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "victorkakama (generated)", id: "1646915942170-4") {
        createTable(tableName: "kenga_user_group") {
            column(name: "kenga_group_id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "kenga_user_groupPK")
            }

            column(name: "user_id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "kenga_user_groupPK")
            }

            column(name: "date_created", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "last_updated", type: "datetime") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "victorkakama (generated)", id: "1646915942170-5") {
        addUniqueConstraint(columnNames: "table_name", constraintName: "UC_KENGA_DATA_TABLETABLE_NAME_COL", tableName: "kenga_data_table")
    }

    changeSet(author: "victorkakama (generated)", id: "1645520788547-2") {
        addColumn(tableName: "role") {
            column(name: "description", type: "varchar(255)")
        }
    }
    changeSet(author: "victorkakama (generated)", id: "1645520788547-1") {
        dropNotNullConstraint(columnDataType: "varchar(255)", columnName: "email", tableName: "user")
    }
    changeSet(author: "victorkakama (generated)", id: "1645545375346-1") {
        dropForeignKeyConstraint(baseTableName: "user_form", constraintName: "FKet5bou1rejvasjlchtk95m0f")
    }
    changeSet(author: "victorkakama (generated)", id: "1645545375346-2") {
        dropForeignKeyConstraint(baseTableName: "user_form", constraintName: "FKm04eqjlt7jll97dnmhk01dsh8")
    }
    changeSet(author: "victorkakama (generated)", id: "1645545375346-5") {
        dropUniqueConstraint(constraintName: "UKd512f11de5e919c52773dbc40494", tableName: "user_form")
    }
    changeSet(author: "victorkakama (generated)", id: "1645545375346-10") {
        dropTable(tableName: "user_form")
    }

    changeSet(author: "Bryan (generated)", id: "1646229444195-1") {
        createTable(tableName: "project_milestone") {
            column(name: "id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "project_milestonePK")
            }

            column(name: "reporting_query", type: "LONGTEXT")

            column(name: "date_created", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "dashboard_table", type: "VARCHAR(255)")

            column(name: "dashboard_query", type: "LONGTEXT")

            column(name: "last_updated", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "name", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "reporting_table", type: "VARCHAR(255)")

            column(name: "description", type: "VARCHAR(255)")
        }
    }

    changeSet(author: "Bryan (generated)", id: "1646313846384-1") {
        createTable(tableName: "program") {
            column(name: "id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "programPK")
            }

            column(name: "title", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "date_created", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "last_updated", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "description", type: "VARCHAR(255)")
        }
    }

    changeSet(author: "Bryan (generated)", id: "1646313846384-2") {
        createTable(tableName: "program_category") {
            column(name: "id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "program_categoryPK")
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

            column(name: "description", type: "VARCHAR(255)")

            column(name: "program_id", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "Bryan (generated)", id: "1646313846384-3") {
        addColumn(tableName: "project_milestone") {
            column(name: "program", type: "varchar(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "Bryan (generated)", id: "1646313846384-4") {
        addColumn(tableName: "project_milestone") {
            column(name: "program_category_id", type: "varchar(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "Bryan (generated)", id: "1646313846384-5") {
        addForeignKeyConstraint(baseColumnNames: "program_id", baseTableName: "program_category", constraintName: "FK1wjnxstqhnlgc5bkgf4so28d7", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "program", validate: "true")
    }

    changeSet(author: "Bryan (generated)", id: "1646313846384-6") {
        addForeignKeyConstraint(baseColumnNames: "program_category_id", baseTableName: "project_milestone", constraintName: "FKlltcynbquxvrpdr5lrrk19gwp", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "program_category", validate: "true")
    }


    changeSet(author: "Bryan (generated)", id: "1646375252167-1") {
        createTable(tableName: "entity_view_filters") {
            column(name: "id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "entity_view_filtersPK")
            }

            column(name: "entity_view_id", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "name", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "filter_query", type: "LONGTEXT")

            column(name: "description", type: "VARCHAR(255)")
        }
    }

    changeSet(author: "Bryan (generated)", id: "1646375252167-2") {
        addForeignKeyConstraint(baseColumnNames: "entity_view_id", baseTableName: "entity_view_filters", constraintName: "FKccsoafxljte0s32kxgj58sy58", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "entity_view", validate: "true")
    }

    changeSet(author: "Bryan (generated)", id: "1646382998928-1") {
        createTable(tableName: "program_partner") {
            column(name: "id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "program_partnerPK")
            }

            column(name: "legal", type: "VARCHAR(255)")

            column(name: "lead_cluster", type: "VARCHAR(255)")

            column(name: "organisation", type: "VARCHAR(255)")

            column(name: "postal_address", type: "VARCHAR(255)")

            column(name: "physical_address", type: "VARCHAR(255)")

            column(name: "name", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "city", type: "VARCHAR(255)")

            column(name: "name_contact_person", type: "VARCHAR(255)")

            column(name: "country", type: "VARCHAR(255)")

            column(name: "email", type: "VARCHAR(255)")

            column(name: "website", type: "VARCHAR(255)")

            column(name: "program_id", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "acronym", type: "VARCHAR(255)")

            column(name: "date_created", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "last_updated", type: "datetime") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "Bryan (generated)", id: "1646382998928-2") {
        addForeignKeyConstraint(baseColumnNames: "program_id", baseTableName: "program_partner", constraintName: "FK2rc72b856yntd7xpsdrj8l0qa", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "program", validate: "true")
    }

    changeSet(author: "BrunoJay (generated)", id: "1646309130239-1") {
        createTable(tableName: "partner_setup") {
            column(name: "id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "partner_setupPK")
            }

            column(name: "setup_values", type: "text") {
                constraints(nullable: "false")
            }

            column(name: "user_id", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "date_created", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "last_updated", type: "datetime") {
                constraints(nullable: "false")
            }

            column(name: "partner_id", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "LENOVO (generated)", id: "1646838666964-1") {
        createTable(tableName: "data_view") {
            column(name: "id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "data_viewPK")
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
        }
    }

    changeSet(author: "victorkakama (generated)", id: "1646915942170-6") {
        addForeignKeyConstraint(baseColumnNames: "kenga_group_id", baseTableName: "kenga_acl_table_record_identity", constraintName: "FK6ftxfqhndokh2opqomfxas4jw", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "kenga_group", validate: "true")
    }

    changeSet(author: "victorkakama (generated)", id: "1646915942170-7") {
        addForeignKeyConstraint(baseColumnNames: "user_id", baseTableName: "kenga_user_group", constraintName: "FKfyp4kgxa9wq5bhqrmupeo0gel", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "user", validate: "true")
    }

    changeSet(author: "victorkakama (generated)", id: "1646915942170-8") {
        addForeignKeyConstraint(baseColumnNames: "kenga_acl_table_record_identity_id", baseTableName: "kenga_group_acl_entry", constraintName: "FKgaqw7dig1l625teoqbl0v70x8", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "kenga_acl_table_record_identity", validate: "true")
    }

    changeSet(author: "victorkakama (generated)", id: "1646915942170-9") {
        addForeignKeyConstraint(baseColumnNames: "kenga_data_table_id", baseTableName: "kenga_acl_table_record_identity", constraintName: "FKhr0nxosgu06xcby1pifmbp8dj", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "kenga_data_table", validate: "true")
    }

    changeSet(author: "victorkakama (generated)", id: "1646915942170-10") {
        addForeignKeyConstraint(baseColumnNames: "kenga_group_id", baseTableName: "kenga_group_acl_entry", constraintName: "FKjq24i33cpngvs0aamferxunvi", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "kenga_group", validate: "true")
    }

    changeSet(author: "victorkakama (generated)", id: "1646915942170-11") {
        addForeignKeyConstraint(baseColumnNames: "kenga_group_id", baseTableName: "kenga_user_group", constraintName: "FKox52rpnuevjm4m048an1pmxwh", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "kenga_group", validate: "true")
    }

    changeSet(author: "victorkakama (generated)", id: "1646915942170-12") {
        dropForeignKeyConstraint(baseTableName: "kenga_group_role", constraintName: "FK6j6xb1j0i5wp1b50f7ff7f39u")
    }

    changeSet(author: "victorkakama (generated)", id: "1646915942170-13") {
        dropForeignKeyConstraint(baseTableName: "kenga_group_role", constraintName: "FK8fmsx15k5wgah0nxu3aojreiy")
    }
    changeSet(author: "victorkakama (generated)", id: "1646915942170-32") {
        dropTable(tableName: "kenga_group_role")
    }
    changeSet(author: "victorkakama (generated)", id: "1646989014226-1") {
        dropNotNullConstraint(columnDataType: "varchar(255)", columnName: "email", tableName: "user")
    }

    changeSet(author: "victorkakama (generated)", id: "1646989014226-2") {
        dropNotNullConstraint(columnDataType: "varchar(255)", columnName: "names", tableName: "user")
    }
    changeSet(author: "bruno (generated)", id: "1647339947546-1") {
        addColumn(tableName: "partner_setup") {
            column(name: "end_date", type: "varchar(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "bruno (generated)", id: "1647339947546-2") {
        addColumn(tableName: "partner_setup") {
            column(name: "period_type", type: "varchar(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "bruno (generated)", id: "1647339947546-3") {
        addColumn(tableName: "partner_setup") {
            column(name: "program_id", type: "varchar(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "bruno (generated)", id: "1647339947546-4") {
        addColumn(tableName: "partner_setup") {
            column(name: "reporting_calendar", type: "text") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "bruno (generated)", id: "1647339947546-5") {
        addColumn(tableName: "partner_setup") {
            column(name: "reporting_start_date", type: "varchar(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "bruno (generated)", id: "1647339947546-6") {
        addColumn(tableName: "partner_setup") {
            column(name: "start_date", type: "varchar(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "bruno (generated)", id: "20220901124635-01") {
        modifyDataType(columnName: "input_variables", newDataType: "LONGTEXT", tableName: "task_list")
    }

    changeSet(author: "bruno (generated)", id: "202209011224245-01") {
        modifyDataType(columnName: "output_variables", newDataType: "LONGTEXT", tableName: "task_list")
    }

    changeSet(author: "victorkakama (generated)", id: "1647936752765-1") {
        addColumn(tableName: "kenga_data_table") {
            column(name: "id_label", type: "varchar(255)")
        }
    }

    changeSet(author: "LENOVO (generated)", id: "1646838666964-1") {
        createTable(tableName: "data_view") {
            column(name: "id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "data_viewPK")
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
        }
    }

    changeSet(author: "LENOVO (generated)", id: "1647253541462-1") {
        addColumn(tableName: "entity_view_filters") {
            column(name: "user_id", type: "varchar(255)")
        }
    }

    changeSet(author: "LENOVO (generated)", id: "1647253541462-2") {
        addForeignKeyConstraint(baseColumnNames: "user_id", baseTableName: "entity_view_filters", constraintName: "FK9432frmitk8mc7gfm3h6gqw9d", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "user", validate: "true")
    }

    changeSet(author: "LENOVO (generated)", id: "1647253541462-2") {
        addForeignKeyConstraint(baseColumnNames: "user_id", baseTableName: "entity_view_filters", constraintName: "FK9432frmitk8mc7gfm3h6gqw9d", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "user", validate: "true")
    }

    changeSet(author: "Bryan (generated)", id: "1647848110366-1") {
        createTable(tableName: "user_entity_view_filters") {
            column(name: "id", type: "VARCHAR(255)") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "user_entity_view_filtersPK")
            }

            column(name: "entity_view_filters_id", type: "VARCHAR(255)") {
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

    changeSet(author: "Bryan (generated)", id: "1647848110366-2") {
        addColumn(tableName: "entity_view_filters") {
            column(name: "date_created", type: "datetime") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "Bryan (generated)", id: "1647848110366-3") {
        addColumn(tableName: "entity_view_filters") {
            column(name: "last_updated", type: "datetime") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "Bryan (generated)", id: "1647848110366-4") {
        addUniqueConstraint(columnNames: "entity_view_filters_id, user_id", constraintName: "UK28e93280ffd3817340e71f819e6b", tableName: "user_entity_view_filters")
    }

    changeSet(author: "Bryan (generated)", id: "1647848110366-5") {
        addForeignKeyConstraint(baseColumnNames: "user_id", baseTableName: "user_entity_view_filters", constraintName: "FK660sr1x5pypub18iwh087qrc2", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "user", validate: "true")
    }

    changeSet(author: "Bryan (generated)", id: "1647848110366-6") {
        addForeignKeyConstraint(baseColumnNames: "entity_view_filters_id", baseTableName: "user_entity_view_filters", constraintName: "FKl1y77w88879q3g1di522fyby4", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "entity_view_filters", validate: "true")
    }

    changeSet(author: "Bryan (generated)", id: "1647585031314-43") {
        dropColumn(columnName: "user_id", tableName: "entity_view_filters")
    }

}
