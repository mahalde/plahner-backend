import { Injectable, OnModuleInit } from '@nestjs/common';
import { Config } from 'imap';
import { connect, ImapSimple, ImapSimpleOptions } from 'imap-simple';
import { LoggerService } from 'src/shared/services/logger.service';

/**
 * An abstraction to work with IMAP mailboxes
 */
@Injectable()
export class ImapService implements OnModuleInit {
  /** The private logger of the service */
  private logger = new LoggerService(ImapService.name);
  /** The imap client used for the connection */
  private imapClient!: ImapSimple;
  /** The current number of retries to connect to the mailbox */
  private retries = 0;

  /**
   * Constructs a new instance of the ImapService
   * @param config the configuration which state the user, password, host, port etc
   * @param maxRetries the maximum number of tries to reconnect to the mailbox
   * @param retryTimeout the timeout between each connection retry
   */
  constructor(
    private config: Config,
    private maxRetries: number,
    private retryTimeout: number,
  ) {}

  /**
   * Method that is called on module initialisation
   */
  async onModuleInit() {
    await this.connectToMailbox();
  }

  /**
   * Connects to the inbox of the user given in the configuration
   */
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

  /**
   * Reconnection method in case of an error during or before the connection
   */
  tryToReconnect() {
    if (this.retries < this.maxRetries) {
      this.retries++;
      setTimeout(() => this.connectToMailbox(), this.retryTimeout);
    }
  }

  /**
   * Function that is called when receiving a new mail
   * @param numberOfMails the number of the mails / new mails in the mailbox
   */
  onNewMail = (numberOfMails: number) => {
    this.logger.info(`New Mails: ${numberOfMails}`);
  };

  /**
   * Function that is called when an error happened
   * @param err the occurred error
   */
  onError = (err: Error) => {
    this.logger.error('Error during connection to IMAP mailbox', err);
    this.tryToReconnect();
  };
}
