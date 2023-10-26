import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurrancedonePage } from './insurrancedone.page';

describe('InsurrancedonePage', () => {
  let component: InsurrancedonePage;
  let fixture: ComponentFixture<InsurrancedonePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsurrancedonePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsurrancedonePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
