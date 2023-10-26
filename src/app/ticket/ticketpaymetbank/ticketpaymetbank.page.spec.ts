import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketpaymetbankPage } from './ticketpaymetbank.page';

describe('TicketpaymetbankPage', () => {
  let component: TicketpaymetbankPage;
  let fixture: ComponentFixture<TicketpaymetbankPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketpaymetbankPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketpaymetbankPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
