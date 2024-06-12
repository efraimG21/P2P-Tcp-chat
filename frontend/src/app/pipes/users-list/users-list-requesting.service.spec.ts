import { TestBed } from '@angular/core/testing';

import { UsersListRequestingService } from './users-list-requesting.service';

describe('UsersListRequestingService', () => {
  let service: UsersListRequestingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersListRequestingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
