import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from 'imap';
import { ImapService } from './services/imap/imap.service';

/**
 * The dependency injection factory for the ImapService
 *
 * Allows for different configurations depending on development
 * or production mode
 *
 * @param configService the injected ConfigService
 */
const imapServiceFactory = (configService: ConfigService) => {
  const keys: Record<
    string,
    StringConstructor | NumberConstructor | BooleanConstructor
  > = {
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
};

/**
 * The module which consists of all stuff regarding
 * IMAP (Internet Message Access Protocol)
 */
@Module({
  providers: [
    {
      provide: ImapService,
      useFactory: imapServiceFactory,
      inject: [ConfigService],
    },
  ],
})
export class ImapModule {}
