import { Message, PubSub } from '@google-cloud/pubsub';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InboxListenerService {
  private readonly logger = new Logger(InboxListenerService.name);

  constructor(private readonly config: ConfigService) { }

  public listenToInbox(): void {
    this.logger.log('Started listener');
    const projectId = this.config.get<string>('GCLOUD_PROJECT_ID');
    const subscriptionName = this.config.get<string>('MAIL_SUBSCRIPTION_ID');

    const pubSub = new PubSub({ projectId });
    const subscription = pubSub.subscription(subscriptionName);

    const messageHandler = (message: Message) => {
      this.logger.log(`Received message ${message.id}:`);
      this.logger.log(`\tData: ${message.data}`);
      this.logger.log(`\tAttributes: ${message.attributes}`);

      message.ack();
    }

    subscription.on('message', messageHandler);
  }
}
