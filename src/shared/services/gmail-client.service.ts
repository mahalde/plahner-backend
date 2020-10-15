import { Logger } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { gmail_v1 } from 'googleapis';

export class GmailClientService {
  private readonly logger = new Logger(GmailClientService.name);

  private gmailClient: gmail_v1.Gmail;

  constructor(
    readonly oAuth2Client: OAuth2Client,
    private readonly userId: string
  ) {
    this.logger.log(oAuth2Client);
    this.gmailClient = new gmail_v1.Gmail({ auth: oAuth2Client as any });
  }

  /**
   * Receives all inbox mail IDs for given userId.
   * @param maxResults How many mails should be received. Defaults to 20
   */
  async getAllInboxMessageIDs(maxResults = 20): Promise<gmail_v1.Schema$Message[] | undefined> {
    try {
      const allMessagesResponse = await this.gmailClient.users.messages.list({ userId: this.userId, maxResults });
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
      const messageResponse = await this.gmailClient.users.messages.get({ userId: this.userId, id });
      return messageResponse.data;
    } catch (err) {
      this.logger.error('Error during fetch of mail:', err);
      return undefined;
    }
  }
}
