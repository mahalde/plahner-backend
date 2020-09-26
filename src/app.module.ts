import { Module } from '@nestjs/common';
import { version } from 'package.json';
import { VERSION_TOKEN } from './app.constants';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: VERSION_TOKEN,
      useValue: version
    }
  ],
})
export class AppModule { }
