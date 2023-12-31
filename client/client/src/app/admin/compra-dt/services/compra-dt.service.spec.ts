import { TestBed } from '@angular/core/testing';

import { CompraDtService } from './compra-dt.service';

describe('CompraDtService', () => {
  let service: CompraDtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompraDtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
