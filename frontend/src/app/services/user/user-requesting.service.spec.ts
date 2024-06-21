import { TestBed } from '@angular/core/testing';

import { UserRequestingService } from './user-requesting.service';

describe('UserRequestingService', () => {
  let service: UserRequestingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserRequestingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
