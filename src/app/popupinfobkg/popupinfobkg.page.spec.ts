import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupinfobkgPage } from './popupinfobkg.page';

describe('PopupinfobkgPage', () => {
  let component: PopupinfobkgPage;
  let fixture: ComponentFixture<PopupinfobkgPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupinfobkgPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupinfobkgPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
