import { TestBed } from '@angular/core/testing';

import { PaycloudService } from './paycloud.service';

describe('PaycloudService', () => {
  let service: PaycloudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaycloudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
