import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { version } from 'package.json';
import { VERSION_TOKEN } from './app.constants';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { isProdMode } from './shared/utils';
import { ImapModule } from './imap/imap.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: isProdMode() ? '.env' : '.development.env',
    }),
    ImapModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: VERSION_TOKEN,
      useValue: version,
    },
  ],
})
export class AppModule {}
