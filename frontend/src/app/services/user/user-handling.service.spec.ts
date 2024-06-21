import { TestBed } from '@angular/core/testing';

import { UserHandlingService } from './user-handling.service';

describe('UserHandlingService', () => {
  let service: UserHandlingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserHandlingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
