import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurrancepopoverPage } from './insurrancepopover.page';

describe('InsurrancepopoverPage', () => {
  let component: InsurrancepopoverPage;
  let fixture: ComponentFixture<InsurrancepopoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsurrancepopoverPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsurrancepopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
