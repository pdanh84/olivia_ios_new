import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightcombopaymentPage } from './flightcombopayment.page';

describe('FlightcombopaymentPage', () => {
  let component: FlightcombopaymentPage;
  let fixture: ComponentFixture<FlightcombopaymentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightcombopaymentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightcombopaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
