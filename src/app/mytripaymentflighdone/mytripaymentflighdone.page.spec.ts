import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MytripaymentflighdonePage } from './mytripaymentflighdone.page';

describe('MytripaymentflighdonePage', () => {
  let component: MytripaymentflighdonePage;
  let fixture: ComponentFixture<MytripaymentflighdonePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MytripaymentflighdonePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MytripaymentflighdonePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
