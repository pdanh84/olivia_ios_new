import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketfilterPage } from './ticketfilter.page';

describe('TicketfilterPage', () => {
  let component: TicketfilterPage;
  let fixture: ComponentFixture<TicketfilterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketfilterPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketfilterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
