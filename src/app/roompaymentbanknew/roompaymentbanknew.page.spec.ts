import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoompaymentbanknewPage } from './roompaymentbanknew.page';

describe('RoompaymentbanknewPage', () => {
  let component: RoompaymentbanknewPage;
  let fixture: ComponentFixture<RoompaymentbanknewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoompaymentbanknewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoompaymentbanknewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
