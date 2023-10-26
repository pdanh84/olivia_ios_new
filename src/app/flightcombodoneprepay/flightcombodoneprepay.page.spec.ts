import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightcombodoneprepayPage } from './flightcombodoneprepay.page';

describe('FlightcombodoneprepayPage', () => {
  let component: FlightcombodoneprepayPage;
  let fixture: ComponentFixture<FlightcombodoneprepayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightcombodoneprepayPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightcombodoneprepayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
