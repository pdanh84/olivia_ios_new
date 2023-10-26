import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketinfoPage } from './ticketinfo.page';

describe('TicketinfoPage', () => {
  let component: TicketinfoPage;
  let fixture: ComponentFixture<TicketinfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketinfoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketinfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
