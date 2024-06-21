import { TestBed } from '@angular/core/testing';

import { ChatRequestingService } from './chat-requesting.service';

describe('ChatRequestingService', () => {
  let service: ChatRequestingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatRequestingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
