import { Module } from '@nestjs/common';
import { WatchInboxService } from './watch-inbox.service';

@Module({
  providers: [WatchInboxService],
})
export class CronJobsModule {}
