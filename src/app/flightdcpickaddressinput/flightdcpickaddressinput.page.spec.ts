import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightdcpickaddressinputPage } from './flightdcpickaddressinput.page';

describe('FlightdcpickaddressinputPage', () => {
  let component: FlightdcpickaddressinputPage;
  let fixture: ComponentFixture<FlightdcpickaddressinputPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightdcpickaddressinputPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightdcpickaddressinputPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
