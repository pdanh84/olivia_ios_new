import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CombodonebankPage } from './combodonebank.page';

describe('CombodonebankPage', () => {
  let component: CombodonebankPage;
  let fixture: ComponentFixture<CombodonebankPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombodonebankPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombodonebankPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
