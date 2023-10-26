import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelupgraderoomPage } from './hotelupgraderoom.page';

describe('HotelupgraderoomPage', () => {
  let component: HotelupgraderoomPage;
  let fixture: ComponentFixture<HotelupgraderoomPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelupgraderoomPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelupgraderoomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
