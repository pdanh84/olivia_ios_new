import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CombocarpaymentpayoonewPage } from './combocarpaymentpayoonew.page';

describe('CombocarpaymentpayoonewPage', () => {
  let component: CombocarpaymentpayoonewPage;
  let fixture: ComponentFixture<CombocarpaymentpayoonewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombocarpaymentpayoonewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombocarpaymentpayoonewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
