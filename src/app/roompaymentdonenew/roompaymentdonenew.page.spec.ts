import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoompaymentdonenewPage } from './roompaymentdonenew.page';

describe('RoompaymentdonenewPage', () => {
  let component: RoompaymentdonenewPage;
  let fixture: ComponentFixture<RoompaymentdonenewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoompaymentdonenewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoompaymentdonenewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
