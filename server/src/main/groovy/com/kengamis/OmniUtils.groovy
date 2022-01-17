package com.kengamis

import org.apache.commons.logging.LogFactory

import java.text.DateFormat
import java.text.SimpleDateFormat

class OmniUtils {
    private static def log = LogFactory.getLog(OmniUtils.class)
    private static DateFormat format = new SimpleDateFormat('yyyy-MM-dd')

    static String formatDate(Date date) {
        if (date) return format.format(date)
        return 'UNKNOWN'
    }

    static String cleanOxdData(def data){
        if (!(data instanceof Date)) {
            data = data + ""
            if (data.contains("slash"))
                data = data.replaceAll("slash", "/")
            if(data.contains("_hyphen_"))
                data = data.replaceAll("_hyphen_","-")
            if (data.contains("_"))
                data = data.replaceAll("_", " ")
        }
        if(data instanceof Date){
            data = data.format('yyyy-MM-dd HH:MM:ss')
        }
        if (data == 'null' || data == null) {
            data = ""
        }
        return data?.toString()
    }

    static String reconstructOxdData(String data){
        if(!(data instanceof Date)){
            data = data+""
            if(data.contains(" "))
                data = data.replaceAll(" ","_")
            if(data.contains("/"))
                data = data.replaceAll("/","slash")
            if(data.contains("-"))
                data = data.replaceAll("-","_hyphen_")
        }
        if(data instanceof Date){
            data = data.format('yyyy-MM-dd HH:MM:ss')
        }
        if(data=='null'){
            data = ""
        }
        return data
    }

    static String breakWord(def index,String str){
        def newword =  str.replaceAll("(.{"+index+"})","\$1<br>");
        return newword
    }

    static def wrap = { text, columns ->
        def result = ""
        def line = ""
        text = text?:""
        text.split(" ").each { word ->
            if (word.length() > columns) {
                def part = word.substring(0, columns - line.length())
                line += part
                word = word.substring(part.length())
            }
            if (line.length() + word.length() > columns) {
                result += line.trim() + "<br>"
                line = ""
            }
            while (word.length() > columns) {
                result += word.substring(0, columns) + "<br>"
                word = word.substring(columns)
            }
            line += word + " "
        }
        result += line.trim()
        result
    }

    //    @CompileStatic
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
}
