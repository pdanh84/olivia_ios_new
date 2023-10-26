import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightcombowarningPage } from './flightcombowarning.page';

describe('FlightcombowarningPage', () => {
  let component: FlightcombowarningPage;
  let fixture: ComponentFixture<FlightcombowarningPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightcombowarningPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightcombowarningPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
