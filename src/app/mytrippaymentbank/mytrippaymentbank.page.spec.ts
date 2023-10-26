import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MytrippaymentbankPage } from './mytrippaymentbank.page';

describe('MytrippaymentbankPage', () => {
  let component: MytrippaymentbankPage;
  let fixture: ComponentFixture<MytrippaymentbankPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MytrippaymentbankPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MytrippaymentbankPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
