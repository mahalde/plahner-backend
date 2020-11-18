import { Injectable, OnModuleInit } from '@nestjs/common';
import { Config } from 'imap';
import { connect, ImapSimple, ImapSimpleOptions } from 'imap-simple';
import { LoggerService } from 'src/shared/services/logger.service';

@Injectable()
export class ImapService implements OnModuleInit {
  private logger = new LoggerService(ImapService.name);
  private imapClient!: ImapSimple;
  private retries = 0;

  constructor(
    private config: Config,
    private maxRetries: number,
    private retryTimeout: number,
  ) {}

  async onModuleInit() {
    await this.connectToMailbox();
  }

  async connectToMailbox() {
    const inboxName = 'INBOX';
    const allConfig: ImapSimpleOptions = {
      imap: {
        ...this.config,
        tlsOptions: {
          rejectUnauthorized: false,
        },
      },
      onmail: this.onNewMail,
    };

    try {
      this.imapClient = await connect(allConfig);
      await this.imapClient.openBox(inboxName);
      this.logger.info(
        `Connected to IMAP mailbox '${inboxName}' on host '${this.config.host}'`,
      );
      this.retries = 0;
      this.imapClient.on('error', this.onError);
    } catch (e) {
      this.logger.error('Error while connecting to IMAP mailbox', e);
      this.tryToReconnect();
    }
  }

  tryToReconnect() {
    if (this.retries < this.maxRetries) {
      this.retries++;
      setTimeout(() => this.connectToMailbox(), this.retryTimeout);
    }
  }

  onNewMail = (numberOfMails: number) => {
    this.logger.info(`New Mails: ${numberOfMails}`);
  };

  onError = (err: Error) => {
    this.logger.error('Error during connection to IMAP mailbox', err);
    this.tryToReconnect();
  };
}
