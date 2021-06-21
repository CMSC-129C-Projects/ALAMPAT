import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderdetailsbuyerComponent } from './orderdetailsbuyer.component';

describe('OrderdetailsbuyerComponent', () => {
  let component: OrderdetailsbuyerComponent;
  let fixture: ComponentFixture<OrderdetailsbuyerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderdetailsbuyerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderdetailsbuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
