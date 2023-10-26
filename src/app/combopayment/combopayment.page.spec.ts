import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CombopaymentPage } from './combopayment.page';

describe('CombopaymentPage', () => {
  let component: CombopaymentPage;
  let fixture: ComponentFixture<CombopaymentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombopaymentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombopaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
