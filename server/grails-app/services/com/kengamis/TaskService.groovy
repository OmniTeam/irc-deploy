package com.kengamis

import grails.plugins.quartz.JobDescriptor
import org.quartz.*

class TaskService {
    Scheduler quartzScheduler
    def jobManagerService

    JobDetail scheduleTask(TaskDef task) {

        mayBeUnScheduleTask(task.name)

        JobDetail jobDetail = JobBuilder.newJob(task.classInstance)
                .withIdentity(task.getName())
                .withDescription(task.description)
                .usingJobData(new JobDataMap(task.properties))
                .build()

        CronTrigger cronTrigger = TriggerBuilder.newTrigger()
                .withIdentity(task.getName())
                .withSchedule(CronScheduleBuilder.cronSchedule(task.getCronExpression()))
                .build()

        quartzScheduler.scheduleJob(jobDetail, cronTrigger)
        log.info("Job scheduled,Job Name:[${task.getName()}]")

        return jobDetail

    }

    def mayBeUnScheduleTask(String name) {
        def jobDescriptor = findJob(name)
        if (jobDescriptor) {
            log.info("Removing Task From Schedule: [${name}]")
            unScheduleTask(jobDescriptor)
        }
    }

    def runFirstTaskWithClass(Class className, Map params = [:]) {
        def jobs = findJobsWithClass(className, params)
        if (jobs) {
            def jobDetail = jobs.pop()
            runNow(jobDetail.name as String)
        } else {
            throw new RuntimeException("Could Find Job With Params: [$className , $params]")
        }
    }

    List<JobDescriptor> findJobsWithClass(Class className, Map params = [:]) {
        def jobDetails = findAllJobsWithClass(className)

        if (!jobDetails) return []

        def filteredDetails = jobDetails.findAll { jd ->
            params.every { k, v -> jd.jobDetail.jobDataMap[k] == v }
        }

        return filteredDetails
    }

    List<JobDescriptor> findAllJobsWithClass(Class aClass) {
        List<JobDescriptor> allJobs = jobManagerService.allJobs.collectMany { it.value }
        return allJobs.findAll { it.jobDetail.jobClass == aClass } as List
    }


    def unScheduleTask(JobDescriptor task) {
        log.info("UnScheduling Job [$task.name]...")
        quartzScheduler.deleteJob(task.jobDetail.key)
    }

    JobDescriptor runNow(String jobName) {
        def jd = findJob(jobName)
        if (!jd) {
            throw new RuntimeException("Could Not Run Job[$jobName] Beacause it was not found in the queue...")
        }
        quartzScheduler.triggerJob(jd.jobDetail.key)
        log.info("Running Job [$jobName]...")
        return jd
    }

    JobDescriptor runNow(TaskDef task) {
        def jd = findJob(task.name)
        if (!jd) {
            scheduleTask(task)
        }
        return runNow(task.name)
    }

    JobDescriptor findJob(String jobName) {
        def jobDescriptor = jobManagerService.allJobs?.collectMany { it.value }?.find { it.name == jobName }
        return jobDescriptor as JobDescriptor
    }

    def shutDownAllJobs() {
        jobManagerService.allJobs?.values()?.flatten()?.each {
            unScheduleTask(it)
        }
        quartzScheduler.shutdown()
    }

}
