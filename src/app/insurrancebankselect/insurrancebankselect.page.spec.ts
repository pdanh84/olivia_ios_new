import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurrancebankselectPage } from './insurrancebankselect.page';

describe('InsurrancebankselectPage', () => {
  let component: InsurrancebankselectPage;
  let fixture: ComponentFixture<InsurrancebankselectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsurrancebankselectPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsurrancebankselectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
