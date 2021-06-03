import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderbuyerComponent } from './orderbuyer.component';

describe('OrderbuyerComponent', () => {
  let component: OrderbuyerComponent;
  let fixture: ComponentFixture<OrderbuyerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderbuyerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderbuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
