import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightcombopaymentpayoonewPage } from './flightcombopaymentpayoonew.page';

describe('FlightcombopaymentpayoonewPage', () => {
  let component: FlightcombopaymentpayoonewPage;
  let fixture: ComponentFixture<FlightcombopaymentpayoonewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightcombopaymentpayoonewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightcombopaymentpayoonewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
