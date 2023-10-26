import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarComboPage } from './carcombo.page';

describe('CarComboPage', () => {
  let component: CarComboPage;
  let fixture: ComponentFixture<CarComboPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarComboPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarComboPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
