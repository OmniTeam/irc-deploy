package com.kengamis

import org.grails.exceptions.reporting.DefaultStackTraceFilterer
import org.owasp.esapi.ESAPI
import org.owasp.esapi.codecs.MySQLCodec

class Util {

    def grailsApplication
    def springSecurityService
    static def stackFilterer = new DefaultStackTraceFilterer(true)

    static def <T extends Throwable> T sanitize(T e, List<String> otherPackages = []) {
        otherPackages?.each {
            stackFilterer.addInternalPackage(it)
        }

        return stackFilterer.filter(e, true) as T
    }

    static List<Integer> toYearRange(Date date = new Date(), IntRange range) {

        def contextualYear = date.toCalendar().get(Calendar.YEAR)

        def years = range.collect { contextualYear + it }

        return years.reverse()
    }

    static String constructFormTable(def formName) {
        return (formName.replaceAll(" ", "_")).toLowerCase()
    }

    static String tryOxdUnEscape(def d) {

        String s = d?.toString()

        if (s == null || s == 'null') return ''

        HashMap<String, String> swapChars = ["!"   : "bang",
                                             "#"   : "pound",
                                             "\\*" : "star",
                                             "'"   : "apos",
                                             "\""  : "quote",
                                             "%"   : "percent",
                                             "<"   : "lt",
                                             ">"   : "gt",
                                             "="   : "eq",
                                             "/"   : "slash",
                                             "\\\\": "backslash",
                                             "\\." : "dot",
                                             "-"   : "hyphen"]



        s = s.replaceAll(/\s_[0-9]/) { it - '_' }

        if (s ==~ '^(_[0-9])') s = s.replaceFirst('_', '')


        swapChars.each { k, v ->
            def regex = "(?i)_$v"
            s = s.replaceAll(regex, k)
        }

        swapChars.each { k, v ->
            String regex = "${k}_"
            String replacement = "$k "
            s = s.replace(regex, replacement)
        }
        s = s.replaceAll('_', ' ')
        return s
    }

    static String escapeField(String field) {
        if (field.contains('`')) throw new IllegalArgumentException("Illegal table name [$field]")
        return "`$field`"
    }

    static String removeExtraSpace(String string) {
        string.toString().replaceAll(/\s+/, ' ').trim()
    }

    static Long extractId(Map params) {
        extractId(params, 'id')
    }

    static String getSqlWildCard(String search) {
        search = search.split(/\s+/).collect { String s -> "${escapeSql(s)}" }.join('%')
        return "%$search%"

    }

    static Long extractId(Map params, String idField) {
        Long id = -1
        try {
            id = (params[idField] as Long) ?: -1
        } catch (Exception x) {
        }
        return id
    }

    static String escapeSql(String sqlParam) {
        def mySqlEncoder = new MySQLCodec(MySQLCodec.Mode.STANDARD)
        def encoded = ESAPI.encoder().encodeForSQL(mySqlEncoder, sqlParam)
        encoded = encoded.replaceAll(/\\_/, "_")
        return encoded
    }

    static <K, V> V getOrCreate(Map<K, V> map, K k, V defaultValue) {
        def value = map[k]

        if (value) return value

        map[k] = defaultValue
        return defaultValue
    }
}
