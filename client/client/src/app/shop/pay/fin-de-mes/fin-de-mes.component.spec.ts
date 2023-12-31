import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinDeMesComponent } from './fin-de-mes.component';

describe('FinDeMesComponent', () => {
  let component: FinDeMesComponent;
  let fixture: ComponentFixture<FinDeMesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinDeMesComponent]
    });
    fixture = TestBed.createComponent(FinDeMesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
