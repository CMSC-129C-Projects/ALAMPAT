import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationSellerComponent } from './reservation-seller.component';

describe('ReservationSellerComponent', () => {
  let component: ReservationSellerComponent;
  let fixture: ComponentFixture<ReservationSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservationSellerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
