import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotellistmoodfilterPage } from './hotellistmoodfilter.page';

describe('HotellistmoodfilterPage', () => {
  let component: HotellistmoodfilterPage;
  let fixture: ComponentFixture<HotellistmoodfilterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotellistmoodfilterPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotellistmoodfilterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
