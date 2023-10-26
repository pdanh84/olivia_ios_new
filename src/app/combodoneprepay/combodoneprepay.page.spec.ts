import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CombodoneprepayPage } from './combodoneprepay.page';

describe('CombodoneprepayPage', () => {
  let component: CombodoneprepayPage;
  let fixture: ComponentFixture<CombodoneprepayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombodoneprepayPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombodoneprepayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
