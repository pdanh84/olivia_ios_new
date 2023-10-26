import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardeparturePage } from './cardeparture.page';

describe('CardeparturePage', () => {
  let component: CardeparturePage;
  let fixture: ComponentFixture<CardeparturePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardeparturePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardeparturePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
