import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestcombocarPage } from './requestcombocar.page';

describe('RequestcombocarPage', () => {
  let component: RequestcombocarPage;
  let fixture: ComponentFixture<RequestcombocarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestcombocarPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestcombocarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
