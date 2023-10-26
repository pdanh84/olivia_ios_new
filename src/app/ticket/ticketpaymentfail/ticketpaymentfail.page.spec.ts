import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketpaymentfailPage } from './ticketpaymentfail.page';

describe('TicketpaymentfailPage', () => {
  let component: TicketpaymentfailPage;
  let fixture: ComponentFixture<TicketpaymentfailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketpaymentfailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketpaymentfailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
