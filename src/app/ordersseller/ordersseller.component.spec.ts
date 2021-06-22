import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderssellerComponent } from './ordersseller.component';

describe('OrderssellerComponent', () => {
  let component: OrderssellerComponent;
  let fixture: ComponentFixture<OrderssellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderssellerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderssellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
