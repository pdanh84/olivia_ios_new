import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginsmsPage } from './loginsms.page';

describe('LoginsmsPage', () => {
  let component: LoginsmsPage;
  let fixture: ComponentFixture<LoginsmsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginsmsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginsmsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
