import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurrancedetailPage } from './insurrancedetail.page';

describe('InsurrancedetailPage', () => {
  let component: InsurrancedetailPage;
  let fixture: ComponentFixture<InsurrancedetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsurrancedetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsurrancedetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
