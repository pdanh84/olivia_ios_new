import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightdcdetailPage } from './flightdcdetail.page';

describe('FlightdcdetailPage', () => {
  let component: FlightdcdetailPage;
  let fixture: ComponentFixture<FlightdcdetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightdcdetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightdcdetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
