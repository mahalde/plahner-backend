import { Controller, Get, Inject } from '@nestjs/common';
import { VERSION_TOKEN } from './app.constants';
import { AppService } from './app.service';

/**
 * The general controller of the backend
 *
 * Consists of general and basic endpoints
 */
@Controller()
export class AppController {
  /**
   * Constructs an instance of the AppController
   * @param appService an instance of the AppService
   * @param version the version of the backend
   */
  constructor(
    private readonly appService: AppService,
    @Inject(VERSION_TOKEN) private readonly version: string,
  ) {}

  /**
   * Endpoint to get a welcome response
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * Endpoint which responds with the backend version
   */
  @Get('version')
  getVersion(): string {
    return this.version;
  }
}
