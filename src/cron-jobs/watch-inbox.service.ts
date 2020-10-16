import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GmailClientService } from 'src/shared/services/gmail-client.service';
import { GCLOUD_TOPIC_NAME } from 'src/shared/shared.constants';

@Injectable()
export class WatchInboxService {

  constructor(
    private readonly config: ConfigService,
    private readonly gmailClient: GmailClientService,
  ) { }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  public async watchGMailInbox(): Promise<void> {
    const topicName = this.config.get<string>(GCLOUD_TOPIC_NAME) ?? '';

    await this.gmailClient.watchInbox(topicName);
  }
}
