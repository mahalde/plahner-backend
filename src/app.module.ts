import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { version } from 'package.json';
import { VERSION_TOKEN } from './app.constants';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AutoEntryModule } from './auto-entry/auto-entry.module';
import { CronJobsModule } from './cron-jobs/cron-jobs.module';
import { SharedModule } from './shared/shared.module';
import { isProdMode } from './shared/utils';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: isProdMode() ? '.env' : '.development.env'
    }),
    ScheduleModule.forRoot(),
    AutoEntryModule,
    CronJobsModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: VERSION_TOKEN,
      useValue: version
    },
  ],
})
export class AppModule { }
