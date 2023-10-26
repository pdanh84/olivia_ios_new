import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightcombobankPage } from './flightcombobank.page';

describe('FlightcombobankPage', () => {
  let component: FlightcombobankPage;
  let fixture: ComponentFixture<FlightcombobankPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightcombobankPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightcombobankPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
