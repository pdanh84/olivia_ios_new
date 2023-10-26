import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightcombolivePage } from './flightcombolive.page';

describe('FlightcombolivePage', () => {
  let component: FlightcombolivePage;
  let fixture: ComponentFixture<FlightcombolivePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightcombolivePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightcombolivePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
