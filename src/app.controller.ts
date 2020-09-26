import { Controller, Get, Inject } from '@nestjs/common';
import { VERSION_TOKEN } from './app.constants';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(VERSION_TOKEN) private version: string
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('version')
  getVersion(): string {
    return this.version;
  }
}
