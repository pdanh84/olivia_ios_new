import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightcombopaymentbreakdownPage } from './flightcombopaymentbreakdown.page';

describe('FlightcombopaymentbreakdownPage', () => {
  let component: FlightcombopaymentbreakdownPage;
  let fixture: ComponentFixture<FlightcombopaymentbreakdownPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightcombopaymentbreakdownPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightcombopaymentbreakdownPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
