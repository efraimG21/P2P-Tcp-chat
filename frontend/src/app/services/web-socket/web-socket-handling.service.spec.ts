import { TestBed } from '@angular/core/testing';

import { WebSocketHandlingService } from './web-socket-handling.service';

describe('WebSocketHandlingService', () => {
  let service: WebSocketHandlingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSocketHandlingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
