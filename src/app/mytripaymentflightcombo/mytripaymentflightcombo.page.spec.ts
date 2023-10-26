import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MytripaymentflightcomboPage } from './mytripaymentflightcombo.page';

describe('MytripaymentflightcomboPage', () => {
  let component: MytripaymentflightcomboPage;
  let fixture: ComponentFixture<MytripaymentflightcomboPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MytripaymentflightcomboPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MytripaymentflightcomboPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
