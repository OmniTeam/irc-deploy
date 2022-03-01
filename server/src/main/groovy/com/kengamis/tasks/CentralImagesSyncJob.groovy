package com.kengamis.tasks

import com.kengamis.AppHolder
import com.kengamis.CentralService
import com.kengamis.Form
import com.kengamis.Study
import com.kengamis.Util
import grails.util.Holders
import groovy.util.logging.Log4j
import org.apache.commons.io.IOUtils

import static com.kengamis.RestHelper.withCentral

@Log4j
class CentralImagesSyncJob extends Script {

    CentralService centralService

    @Override
    Object run() {
        try {
            centralService = AppHolder.bean('centralService')
            def token = centralService.get()
            def study = Study.findByCentralId('9')
            syncCentralImages(study, token)
        }
        catch (Exception e) {
            println("Exception: " + e.getMessage())
        }
    }

    static def syncCentralImages(study, token) {
        try {
            log.info("===========SYNCING STUDY [$study.name]")
            def forms = withCentral { listForms(study.centralId, token) }
            for (form in forms) {
                try {
                    syncFormImages(study, form, token)
                }
                catch (Exception ex) {
                    log.error("ERROR:::: Failed to synchronise [${form.name}] !!!", Util.sanitize(ex))
                }
            }
        }
        catch (Exception ex) {
            log.error("Failed to Synchronise Form, [$study]", ex)
        }
        log.info("=============Finished syncing data For Study [$study.name]========\n\n")
    }

    static def syncFormImages(Study study, def form, def token) {
        log.info("======= Syncing Form Images [$study.name -> $form.name] ========================")
        def studyCentralId = study.centralId as String
        def formCentralId = form['xmlFormId'] as String

        def submissions = withCentral { getFormSubmissions(token, studyCentralId, formCentralId) }
        log.info(" -> Found [${submissions.size()}] records for form [${formCentralId}]")
        submissions.eachWithIndex { submission, idx ->
            log.info(" -> downloading record [${idx}] for form [${formCentralId}]")
            downloadFormAttachments(studyCentralId, formCentralId, submission.instanceId, token)
        }
    }

    static def downloadFormAttachments(def projectId, def xmlFormId, def instanceId, def token) {
        def uploadPath = Holders.grailsApplication.config.imageFolder as String
        def attachments = withCentral { listExpectedAttachments(token, projectId, xmlFormId, instanceId) }
        attachments.each { att ->
            def downloaded = withCentral { downloadAttachment(token, projectId, xmlFormId, instanceId, att.name) }
            if (downloaded) {
                log.info("==================================>> copying image into directory:${uploadPath}")
                IOUtils.copy(downloaded, new FileOutputStream("${uploadPath}${att.name}"))
            }
        }
    }
}
