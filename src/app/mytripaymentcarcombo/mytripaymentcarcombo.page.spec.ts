import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MytripaymentcarcomboPage } from './mytripaymentcarcombo.page';

describe('MytripaymentcarcomboPage', () => {
  let component: MytripaymentcarcomboPage;
  let fixture: ComponentFixture<MytripaymentcarcomboPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MytripaymentcarcomboPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MytripaymentcarcomboPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
