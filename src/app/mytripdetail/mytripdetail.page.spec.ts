import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MytripdetailPage } from './mytripdetail.page';

describe('MytripdetailPage', () => {
  let component: MytripdetailPage;
  let fixture: ComponentFixture<MytripdetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MytripdetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MytripdetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
