import { TestBed } from '@angular/core/testing';

import { ChatHandlingService } from './chat-handling.service';

describe('ChatHandlingService', () => {
  let service: ChatHandlingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatHandlingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
