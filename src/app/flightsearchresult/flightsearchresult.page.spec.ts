import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightsearchresultPage } from './flightsearchresult.page';

describe('FlightsearchresultPage', () => {
  let component: FlightsearchresultPage;
  let fixture: ComponentFixture<FlightsearchresultPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightsearchresultPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightsearchresultPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
