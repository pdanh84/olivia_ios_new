import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightpaymentdonebankPage } from './flightpaymentdonebank.page';

describe('FlightpaymentdonebankPage', () => {
  let component: FlightpaymentdonebankPage;
  let fixture: ComponentFixture<FlightpaymentdonebankPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightpaymentdonebankPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightpaymentdonebankPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
