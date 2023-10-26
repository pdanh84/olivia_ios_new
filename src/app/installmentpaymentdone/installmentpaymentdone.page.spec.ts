import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallmentpaymentdonePage } from './installmentpaymentdone.page';

describe('InstallmentpaymentdonePage', () => {
  let component: InstallmentpaymentdonePage;
  let fixture: ComponentFixture<InstallmentpaymentdonePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstallmentpaymentdonePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallmentpaymentdonePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
