import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoompaymentpayooPage } from './roompaymentpayoo.page';

describe('RoompaymentpayooPage', () => {
  let component: RoompaymentpayooPage;
  let fixture: ComponentFixture<RoompaymentpayooPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoompaymentpayooPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoompaymentpayooPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
