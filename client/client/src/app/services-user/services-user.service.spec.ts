import { TestBed } from '@angular/core/testing';

import { ServicesUserService } from './services-user.service';

describe('ServicesUserService', () => {
  let service: ServicesUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicesUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
