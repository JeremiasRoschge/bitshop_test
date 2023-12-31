import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaycloudComponent } from './paycloud.component';

describe('PaycloudComponent', () => {
  let component: PaycloudComponent;
  let fixture: ComponentFixture<PaycloudComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaycloudComponent]
    });
    fixture = TestBed.createComponent(PaycloudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
