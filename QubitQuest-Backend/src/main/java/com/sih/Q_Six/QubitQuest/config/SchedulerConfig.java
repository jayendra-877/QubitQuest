package com.sih.Q_Six.QubitQuest.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

@Configuration
public class SchedulerConfig {

    @Bean
    public TaskScheduler arenaTaskScheduler() {

        ThreadPoolTaskScheduler scheduler =
                new ThreadPoolTaskScheduler();

        scheduler.setPoolSize(10);

        scheduler.setThreadNamePrefix(
                "arena-scheduler-"
        );

        scheduler.initialize();

        return scheduler;
    }
}
