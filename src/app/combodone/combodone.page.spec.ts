import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CombodonePage } from './combodone.page';

describe('CombodonePage', () => {
  let component: CombodonePage;
  let fixture: ComponentFixture<CombodonePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombodonePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombodonePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
