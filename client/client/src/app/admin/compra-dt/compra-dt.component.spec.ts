import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraDtComponent } from './compra-dt.component';

describe('CompraDtComponent', () => {
  let component: CompraDtComponent;
  let fixture: ComponentFixture<CompraDtComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompraDtComponent]
    });
    fixture = TestBed.createComponent(CompraDtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
