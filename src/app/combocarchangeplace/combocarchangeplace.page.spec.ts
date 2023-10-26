import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CombocarchangeplacePage } from './combocarchangeplace.page';

describe('CombocarchangeplacePage', () => {
  let component: CombocarchangeplacePage;
  let fixture: ComponentFixture<CombocarchangeplacePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombocarchangeplacePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombocarchangeplacePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
