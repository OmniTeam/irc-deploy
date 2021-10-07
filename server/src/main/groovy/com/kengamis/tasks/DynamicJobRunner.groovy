package com.kengamis.tasks

import com.kengamis.AppHolder
import com.kengamis.ScriptService
import groovy.util.logging.Slf4j
import org.quartz.Job
import org.quartz.JobExecutionContext
import org.quartz.JobExecutionException


@Slf4j
class DynamicJobRunner implements Job {

    @Override
    void execute(JobExecutionContext context) throws JobExecutionException {
        List<JobExecutionContext> jobs = context.getScheduler().getCurrentlyExecutingJobs()
        for(JobExecutionContext job : jobs) {
            def otherJobTrigger = job.getTrigger()
            def thisJobTrigger = context.getTrigger()

            def otherFireId = job.getFireInstanceId()
            def thisFireId = context.getFireInstanceId()

            if(otherJobTrigger.jobKey == thisJobTrigger.jobKey && otherFireId != thisFireId) {
                log.info("There is another instance[$job.jobDetail.key] running, so leaving")
                return
            }
        }

        def params = context.jobDetail.jobDataMap
        String extraParams = params['extraParams']
        log.info("Starting Job [${params['name']}].........")
        handleExtraParams(extraParams)
        log.info("FINISHED Job [${params['name']}]")
    }

    @SuppressWarnings("GrMethodMayBeStatic")
    private void handleExtraParams(String params) {
        def service = AppHolder.bean(ScriptService)
        service.evaluate(params)
    }
}
