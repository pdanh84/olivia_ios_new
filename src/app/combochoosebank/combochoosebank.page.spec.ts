import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CombochoosebankPage } from './combochoosebank.page';

describe('CombochoosebankPage', () => {
  let component: CombochoosebankPage;
  let fixture: ComponentFixture<CombochoosebankPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombochoosebankPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombochoosebankPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
