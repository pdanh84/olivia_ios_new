import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersupportdonePage } from './ordersupportdone.page';

describe('OrdersupportdonePage', () => {
  let component: OrdersupportdonePage;
  let fixture: ComponentFixture<OrdersupportdonePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersupportdonePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersupportdonePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
