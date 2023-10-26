import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MytripaymentselectPage } from './mytripaymentselect.page';

describe('MytripaymentselectPage', () => {
  let component: MytripaymentselectPage;
  let fixture: ComponentFixture<MytripaymentselectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MytripaymentselectPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MytripaymentselectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
