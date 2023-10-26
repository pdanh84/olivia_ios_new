import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MytripaymentflightpayooPage } from './mytripaymentflightpayoo.page';

describe('MytripaymentflightpayooPage', () => {
  let component: MytripaymentflightpayooPage;
  let fixture: ComponentFixture<MytripaymentflightpayooPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MytripaymentflightpayooPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MytripaymentflightpayooPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
