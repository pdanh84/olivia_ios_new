import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketpaymentbankPage } from './ticketpaymentbank.page';

describe('TicketpaymentbankPage', () => {
  let component: TicketpaymentbankPage;
  let fixture: ComponentFixture<TicketpaymentbankPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketpaymentbankPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketpaymentbankPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
