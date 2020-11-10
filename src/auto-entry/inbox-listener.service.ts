import { Message, PubSub } from '@google-cloud/pubsub';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from 'src/shared/services/logger.service';
import {
  GCLOUD_PROJECT_ID,
  GCLOUD_SUBSCRIPTION_NAME,
} from 'src/shared/shared.constants';

@Injectable()
export class InboxListenerService implements OnModuleInit {
  private readonly logger = new LoggerService(InboxListenerService.name);

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    this.listenToInbox();
  }

  public listenToInbox(): void {
    this.logger.info('Started listener');
    const projectId = this.config.get<string>(GCLOUD_PROJECT_ID);
    const subscriptionName = this.config.get<string>(
      GCLOUD_SUBSCRIPTION_NAME,
      '',
    );

    const pubSub = new PubSub({ projectId });
    this.logger.info(pubSub.options);
    this.logger.info(pubSub.isEmulator);
    const subscription = pubSub.subscription(subscriptionName);

    const messageHandler = (message: Message) => {
      this.logger.info(`Received message ${message.id}:`);
      this.logger.info(`\tData: ${message.data}`);
      this.logger.info(`\tAttributes: ${message.attributes}`);

      message.ack();
    };

    subscription.on('message', messageHandler);
  }
}
