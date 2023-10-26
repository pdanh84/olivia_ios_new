import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersupportPage } from './ordersupport.page';

describe('OrdersupportPage', () => {
  let component: OrdersupportPage;
  let fixture: ComponentFixture<OrdersupportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersupportPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersupportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
