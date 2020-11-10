import { OAuth2Client } from 'google-auth-library';
import { gmail_v1 } from 'googleapis';
import { LoggerService } from './logger.service';

export class GmailClientService {
  private readonly logger = new LoggerService(GmailClientService.name);

  /** The gmail client responsible for handling API requests */
  private readonly gmailClient: gmail_v1.Gmail;

  constructor(
    readonly oAuth2Client: OAuth2Client,
    private readonly userId: string,
  ) {
    this.gmailClient = new gmail_v1.Gmail({ auth: oAuth2Client as any });
  }

  /**
   * Send a request to watch the inbox for specified userId
   * @param topicName The name of the Pub/Sub topic to publish the events to
   */
  async watchInbox(topicName: string): Promise<void> {
    try {
      await this.gmailClient.users.watch({
        userId: this.userId,
        requestBody: { topicName },
      });
      this.logger.info('Request to watch inbox handled successfully');
    } catch (err) {
      this.logger.error('Error while watching inbox:', err);
    }
  }

  /**
   * Receives all inbox mail IDs for given userId.
   * @param maxResults How many mails should be received. Defaults to 20
   */
  async getAllInboxMessageIDs(
    maxResults = 20,
  ): Promise<gmail_v1.Schema$Message[] | undefined> {
    try {
      const allMessagesResponse = await this.gmailClient.users.messages.list({
        userId: this.userId,
        maxResults,
      });
      return allMessagesResponse.data.messages;
    } catch (err) {
      this.logger.error('Error during fetching of mails:', err);
      return undefined;
    }
  }

  /**
   * Retrieves the mail with the given ID
   * @param id The ID of the mail
   */
  async getMail(id: string): Promise<gmail_v1.Schema$Message | undefined> {
    try {
      const messageResponse = await this.gmailClient.users.messages.get({
        userId: this.userId,
        id,
      });
      return messageResponse.data;
    } catch (err) {
      this.logger.error('Error during fetch of mail:', err);
      return undefined;
    }
  }
}
