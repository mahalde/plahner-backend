import { Module } from '@nestjs/common';
import { InboxListenerService } from './inbox-listener.service';

@Module({
  providers: [InboxListenerService]
})
export class AutoEntryModule {

  constructor(listenerService: InboxListenerService) {
    listenerService.listenToInbox();
  }
}
