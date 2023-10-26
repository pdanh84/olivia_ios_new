import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketfilterlistPage } from './ticketfilterlist.page';

describe('TicketfilterlistPage', () => {
  let component: TicketfilterlistPage;
  let fixture: ComponentFixture<TicketfilterlistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketfilterlistPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketfilterlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
