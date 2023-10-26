import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MytripcathayPage } from './mytripcathay.page';

describe('MytripcathayPage', () => {
  let component: MytripcathayPage;
  let fixture: ComponentFixture<MytripcathayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MytripcathayPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MytripcathayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
