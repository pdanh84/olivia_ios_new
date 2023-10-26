import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CombocarnewPage } from './combocarnew.page';

describe('CombocarnewPage', () => {
  let component: CombocarnewPage;
  let fixture: ComponentFixture<CombocarnewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombocarnewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombocarnewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
