package com.kengamis

import org.jooq.Field
import org.jooq.Table
import org.jooq.impl.DSL

/**
 * Created by kay on 1/11/2017.
 */
class JooqUtil {

    static <T> Field<T> field(Class<T> datatype, String... qualifiedName) {
        DSL.field(DSL.name(qualifiedName), datatype)
    }

    static Field field(String... qualifiedName) {
        DSL.field(DSL.name(qualifiedName))
    }

    static Field field(String tableALias,String qualifiedName){
        DSL.field(DSL.name(tableALias,qualifiedName))
    }

    static Table table(String... qualifiedName) {
        DSL.table(DSL.name(qualifiedName))
    }
}
