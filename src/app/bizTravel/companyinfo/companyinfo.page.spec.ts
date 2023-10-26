import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyinfoPage } from './companyinfo.page';

describe('CompanyinfoPage', () => {
  let component: CompanyinfoPage;
  let fixture: ComponentFixture<CompanyinfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyinfoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyinfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
