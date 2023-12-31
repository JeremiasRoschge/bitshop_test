import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCompraComponent } from './user-compra.component';

describe('UserCompraComponent', () => {
  let component: UserCompraComponent;
  let fixture: ComponentFixture<UserCompraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserCompraComponent]
    });
    fixture = TestBed.createComponent(UserCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
