import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `Hello from the Plahner Backend in ${process.env.NODE_ENV} mode!`;
  }
}
