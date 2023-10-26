import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CombocarpaymentbreakdownPage } from './combocarpaymentbreakdown.page';

describe('CombocarpaymentbreakdownPage', () => {
  let component: CombocarpaymentbreakdownPage;
  let fixture: ComponentFixture<CombocarpaymentbreakdownPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombocarpaymentbreakdownPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombocarpaymentbreakdownPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
