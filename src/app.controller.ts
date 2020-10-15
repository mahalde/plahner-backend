import { Controller, Get, Inject } from '@nestjs/common';
import { VERSION_TOKEN } from './app.constants';
import { AppService } from './app.service';
import { GmailClientService } from './shared/services/gmail-client.service';
import { asyncMap } from './shared/utils';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly gmailClient: GmailClientService,
    @Inject(VERSION_TOKEN) private readonly version: string
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('version')
  getVersion(): string {
    return this.version;
  }

  @Get('mailIDs')
  getMailIDs() {
    return this.gmailClient.getAllInboxMessageIDs();
  }

  @Get('mail')
  async getMail() {
    const mailIDs = await this.gmailClient.getAllInboxMessageIDs();
    return asyncMap(mailIDs, id => this.gmailClient.getMail(id.id));
  }
}
