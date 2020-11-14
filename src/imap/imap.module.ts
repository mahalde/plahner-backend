import { Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from 'imap';
import { ImapService } from './services/imap/imap.service';

const imapServiceFactory: Provider<ImapService> = {
  provide: ImapService,
  useFactory: (configService: ConfigService) => {
    const keys = {
      IMAP_USER: String,
      IMAP_PASSWORD: String,
      IMAP_HOST: String,
      IMAP_PORT: Number,
      IMAP_TLS: Boolean,
    };

    const config = Object.entries(keys).reduce(
      (prev, [key, func]) => ({
        ...prev,
        [key.replace('IMAP_', '').toLowerCase()]: func(configService.get(key)),
      }),
      {} as Config,
    );

    const maxRetries = 5;
    const retryTimeout = 5000;

    return new ImapService(config, maxRetries, retryTimeout);
  },
  inject: [ConfigService],
};

@Module({
  providers: [imapServiceFactory],
})
export class ImapModule {}
