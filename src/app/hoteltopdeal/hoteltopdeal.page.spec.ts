import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelTopDealPage } from './hoteltopdeal.page';

describe('HotelTopDealPage', () => {
  let component: HotelTopDealPage;
  let fixture: ComponentFixture<HotelTopDealPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelTopDealPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelTopDealPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
