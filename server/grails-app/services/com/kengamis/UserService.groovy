package com.kengamis

import fuzzycsv.FuzzyCSV
import fuzzycsv.FuzzyCSVTable
import grails.gorm.services.Service
import grails.gorm.transactions.Transactional
import org.grails.plugins.excelimport.AbstractExcelImporter
import org.grails.plugins.excelimport.ExcelImportService
import org.springframework.web.multipart.MultipartFile

@Transactional
class UserService extends AbstractExcelImporter{

    ExcelImportService excelImportService
    User get(Serializable id){
        return User.get(id)
    }

    List<User> list(Map args){
        return User.list(args)
    }

    Long count(){
        return  User.count()
    }

    void delete(Serializable id){
        def user = get(id)
        user.delete(flush: true, failOnError:true)
    }

    User save(User user){
        def saved = user.save(flush:true, failOnError: true)
        saved
    }

    @Transactional
    def importUsers(MultipartFile file) {
        try{
//            excelImportService = new ExcelImportService()
//            this.readFromStream(file.inputStream)
            def csv = FuzzyCSVTable.parseCsv(new InputStreamReader(file.inputStream))
            print(csv)
            csv.each {record->
                def user = User.find(record.Username)?:
                        new User(
                                names: record.Name,
                                username: record.Username,
                                password: record.Password,
                                email: record.Email,
                        ).save(flush: true, failOnError: true)

            }
        }catch(Exception ex) {
            ex.printStackTrace()
        }
    }

}