package com.kengamis

class FileManagerController {
    static responseFormats = ['json', 'xml']

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
        if(!folder.empty) generatedPath = folder + '/' + generatedPath

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

}
