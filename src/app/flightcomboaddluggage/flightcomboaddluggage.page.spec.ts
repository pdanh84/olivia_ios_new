import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightcomboaddluggagePage } from './flightcomboaddluggage.page';

describe('FlightcomboaddluggagePage', () => {
  let component: FlightcomboaddluggagePage;
  let fixture: ComponentFixture<FlightcomboaddluggagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightcomboaddluggagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightcomboaddluggagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
