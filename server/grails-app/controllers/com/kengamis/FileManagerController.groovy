package com.kengamis

import grails.gorm.transactions.Transactional
import org.apache.poi.xssf.usermodel.XSSFWorkbook
import org.springframework.web.multipart.MultipartFile

import java.sql.Timestamp
import java.text.SimpleDateFormat

import static com.kengamis.Util.escapeField
import static com.kengamis.Util.escapeField

class FileManagerController {
    static responseFormats = ['json', 'xml']
    MisEntityService misEntityService
    def springSecurityService

    static generator = { String alphabet, int n ->
        new Random().with {
            (1..n).collect { alphabet[nextInt(alphabet.length())] }.join()
        }
    }

    def uploadFile() {
        def f = request.getFile('file')
        def folder = request.getParameter('folder')

        if (f.empty) {
            flash.message = "Please upload a document"
            respond "Please upload a document"
            return
        }
        String originalFileName = f.originalFilename
        String generatedPath = generator((('A'..'Z') + ('0'..'9')).join(), 9) + '/' + originalFileName
        if(folder) generatedPath = folder + '/' + generatedPath

        def uploadPath = grailsApplication.config.uploadFolder as String

        File destnFile = new File(uploadPath + generatedPath)
        if (!destnFile.exists()) destnFile.mkdirs()
        f.transferTo(destnFile)

        println "generatedPath $generatedPath"

        respond path: generatedPath
    }

    def downloadFile() {
        def path = request.getParameter('path')
        if (path) {
            def uploadPath = grailsApplication.config.uploadFolder as String
            def file = new File(uploadPath + path)
            if (file.exists()) {
                response.outputStream << file.bytes
            }
        }
    }

    def uploadExcel() {
        def message = ["Data imported successfully"]
        def f = request.getFile('file')
        def id = request.getParameter('id')

        if(!f.empty) {
            MultipartFile file = f
            println "================"
            println file.originalFilename

            def sheetheader = []
            def values = []
            def workbook = new XSSFWorkbook(file.getInputStream())
            def sheet = workbook.getSheetAt(0)

            for (cell in sheet.getRow(0).cellIterator()) {
                sheetheader << cell.stringCellValue
            }

            def headerFlag = true
            for (row in sheet.rowIterator()) {
                if (headerFlag) {
                    headerFlag = false
                    continue
                }
                def value = ''
                def map = [:]
                for (cell in row.cellIterator()) {
                    switch(cell.cellType) {
                        case 1:
                            value = cell.stringCellValue
                            map["${sheetheader[cell.columnIndex]}"] = value
                            break
                        case 0:
                            value = cell.numericCellValue
                            map["${sheetheader[cell.columnIndex]}"] = value
                            break
                        default:
                            value = ''
                    }
                }
                values.add(map)
            }

            values.each { v ->
                importEntityRecord(id, v)
            }
        }
        respond message
    }

    @Transactional
    def importEntityRecord(def misEntityId, def data) {
        try {
            def misEntity = MisEntity.get(misEntityId)
            def id = UUID.randomUUID() as String
            def submitterName = springSecurityService.currentUser as User
            def simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
            def dateCreated = Timestamp.valueOf(simpleDateFormat.format(new Date()))
            def uniqueId = "uuid:" + UUID.randomUUID() as String
            def columns = []
            def values = []

            // Use the prefix and entity to generate the unique code
            def prefix = misEntity.prefix
            def nextIncrementValue = getNextIncrementValueFromPrefixTable(misEntity)
            def code = generateCode(prefix, nextIncrementValue)

            // Split submitted data into columns and values
            data.each { key, value ->
                columns << "_${key.replaceAll("\\s+", "_").toLowerCase()}"
                values << "'${value}'"
            }

            // Add code and its value as a data to be inserted in the entity table
            columns << '_code'
            values << "'${code}'"

            //Insert into prefix Table
            def queryInsertPrefixIncrement = "INSERT IGNORE INTO ${escapeField misEntity.prefixIncrementTable} (id, mis_entity_id, record_id, prefix, increment_value, code, date_created) values ('${UUID.randomUUID() as String}', '${misEntity.id}', '${id}', '${prefix}', '${nextIncrementValue}', '${code}',  '${dateCreated}')"
            log.trace(queryInsertPrefixIncrement)
            def resultIncrement = AppHolder.withMisSql { execute(queryInsertPrefixIncrement.toString()) }
            if (!resultIncrement) {
                log.info("Table ${misEntity.prefixIncrementTable} successfully inserted a record")
            }

            // Insert into Entity Table
            def query = "INSERT IGNORE INTO ${escapeField misEntity.tableName} (id, submitterName, date_created, unique_id, ${columns.join(", ")}) values ('${id}', '${submitterName.username}', '${dateCreated}', '${uniqueId}', ${values.join(", ")})"
            log.trace(query)
            println query
            def result = AppHolder.withMisSql { execute(query.toString()) }
            if (!result) {
                log.info("Table ${misEntity.tableName} successfully inserted a record")
            }

            //update tags
            data.each {key, value ->
                if(key=="TAG" || key=="tag" || key=="Tag") tagEntityRecordOnImport(misEntityId,value,id)
            }
        }
        catch (Exception ex) {
            ex.printStackTrace()
        }
    }

    @Transactional
    def tagEntityRecordOnImport(def misEntityId, def tagName, def recordId) {
        def tag = Tag.findByName(tagName)
        def tagTypeId = tag.tagTypeId
        def tagId = tag.id

        def simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
        def dateCreated = Timestamp.valueOf(simpleDateFormat.format(new Date()))
        def id = UUID.randomUUID() as String
        def misEntity = MisEntity.get(misEntityId)

        //Insert into Tag Table
        def checkIfTagExists = "select * from ${escapeField misEntity.entityTagTable} where tag_id = '${tagId}' and record_id = '${recordId}'".toString()
        def checks = AppHolder.withMisSqlNonTx { rows(checkIfTagExists) }
        if (checks.size() == 0) {
            def queryInsertTag = "INSERT IGNORE INTO ${escapeField misEntity.entityTagTable} (id, mis_entity_id, record_id, tag_type_id, tag_id, date_created) values ('${id}', '${misEntityId}', '${recordId}', '${tagTypeId}', '${tagId}', '${dateCreated}')"
            log.info(queryInsertTag)
            def result = AppHolder.withMisSql { execute(queryInsertTag.toString()) }
            if (!result) {
                log.info("Entity Tag Table ${misEntity.entityTagTable} successfully inserted a record")
            }
        }

        def recordTags = getRecordTags(misEntity, recordId)

        def updateQuery = "update ${escapeField misEntity.tableName} set _tag = '${recordTags}' where id = '${recordId}'".toString()
        log.info(updateQuery)
        def resultUpdate = AppHolder.withMisSql { execute(updateQuery.toString()) }
        if (!resultUpdate) {
            log.info("Table ${misEntity.tableName} successfully updated a record")
        }
    }

    def getRecordTags(MisEntity misEntity, def recordId) {
        def tagNames = []
        def queryTagIds = "select tag_id from ${escapeField misEntity.entityTagTable} where record_id = '${recordId}'".toString()
        log.trace(queryTagIds)
        def resultTagIds = AppHolder.withMisSql { rows(queryTagIds.toString()) }
        if (resultTagIds.size() > 0) {
            resultTagIds.each {
                def tag = Tag.findById(it['tag_id'].toString())
                tagNames << tag.name
            }
            return tagNames.join(", ")
        }
        return ''
    }

    def generateCode(def prefix, def increment_value) {
        def actualIncrementValue = addingLeadingZerosToIncrement(increment_value)
        def code = prefix.toString() + '/' + actualIncrementValue.toString()
        return code
    }

    def getNextIncrementValueFromPrefixTable(MisEntity misEntity) {
        def query = "select max(increment_value) as max_value from ${escapeField misEntity.prefixIncrementTable}"
        def result = AppHolder.withMisSql { rows(query.toString()) }
        if (!result.first()['max_value']) {
            return 1
        } else {
            return result.first()['max_value'] + 1
        }
    }

    def addingLeadingZerosToIncrement(def increment_value) {
        def stringLength = 6
        def incrementValueLen = increment_value.toString().size()
        def expectedLen = stringLength.toInteger() - incrementValueLen.toInteger()
        for (def i = 0; i <= expectedLen - 1; i++) {
            increment_value = "0" + increment_value
        }
        return increment_value
    }


}
