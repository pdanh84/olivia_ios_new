import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurranceNotePage } from './insurrancenote.page';

describe('InsurranceNotePage', () => {
  let component: InsurranceNotePage;
  let fixture: ComponentFixture<InsurranceNotePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsurranceNotePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsurranceNotePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
