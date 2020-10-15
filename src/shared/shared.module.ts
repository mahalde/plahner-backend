import { Module, Provider } from '@nestjs/common';
import { readFileSync } from 'fs';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { GmailClientService } from './services/gmail-client.service';
import { OAUTH2_ACCESS_TOKEN_PATH, OAUTH2_CREDENTIALS_PATH } from './shared.constants';

interface OAuth2AccessToken {
  access_token: string;
  refresh_token?: string;
  scope: string;
  token_type: string;
  expiry_date: number;
}

interface OAuth2ClientCredentials {
  web: {
    client_id: string;
    project_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_secret: string;
    redirect_uris: string[];
    javascript_origins: string[];
  }
}

const oAuth2ClientFactory: Provider<OAuth2Client> = {
  provide: OAuth2Client,
  useFactory: () => {
    const token: OAuth2AccessToken = JSON.parse(readFileSync(OAUTH2_ACCESS_TOKEN_PATH).toString());
    const { web: credentials }: OAuth2ClientCredentials = JSON.parse(readFileSync(OAUTH2_CREDENTIALS_PATH).toString());
    const oAuth2Client = new google.auth.OAuth2(credentials.client_id, credentials.client_secret, credentials.redirect_uris[0]);
    oAuth2Client.setCredentials(token);
    return oAuth2Client as any;
  }
}

const gmailClientFactory: Provider<GmailClientService> = {
  provide: GmailClientService,
  useFactory: (oAuth2Client: OAuth2Client) => {
    const userId = 'me';
    console.log(oAuth2Client);
    return new GmailClientService(oAuth2Client, userId);
  },
  inject: [OAuth2Client]
}

@Module({
  providers: [
    GmailClientService,
    oAuth2ClientFactory,
    gmailClientFactory
  ],
  exports: [gmailClientFactory]
})
export class SharedModule { }
