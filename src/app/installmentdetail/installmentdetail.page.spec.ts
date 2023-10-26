import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallmentdetailPage } from './installmentdetail.page';

describe('InstallmentdetailPage', () => {
  let component: InstallmentdetailPage;
  let fixture: ComponentFixture<InstallmentdetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstallmentdetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallmentdetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
