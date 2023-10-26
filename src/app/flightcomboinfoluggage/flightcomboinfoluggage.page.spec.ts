import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightcomboinfoluggagePage } from './flightcomboinfoluggage.page';

describe('FlightcomboinfoluggagePage', () => {
  let component: FlightcomboinfoluggagePage;
  let fixture: ComponentFixture<FlightcomboinfoluggagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightcomboinfoluggagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightcomboinfoluggagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
