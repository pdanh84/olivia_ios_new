import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginsmsverifyPage } from './loginsmsverify.page';

describe('LoginsmsverifyPage', () => {
  let component: LoginsmsverifyPage;
  let fixture: ComponentFixture<LoginsmsverifyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginsmsverifyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginsmsverifyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
