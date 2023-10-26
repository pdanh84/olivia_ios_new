import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CusimgreviewPage } from './cusimgreview.page';

describe('CusimgreviewPage', () => {
  let component: CusimgreviewPage;
  let fixture: ComponentFixture<CusimgreviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CusimgreviewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CusimgreviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
