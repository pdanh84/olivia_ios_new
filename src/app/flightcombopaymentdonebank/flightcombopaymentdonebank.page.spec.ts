import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightcombopaymentdonebankPage } from './flightcombopaymentdonebank.page';

describe('FlightcombopaymentdonebankPage', () => {
  let component: FlightcombopaymentdonebankPage;
  let fixture: ComponentFixture<FlightcombopaymentdonebankPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightcombopaymentdonebankPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightcombopaymentdonebankPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
