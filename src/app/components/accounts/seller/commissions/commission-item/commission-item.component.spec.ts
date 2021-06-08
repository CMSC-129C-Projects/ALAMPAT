import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionItemComponent } from './commission-item.component';

describe('CommissionItemComponent', () => {
  let component: CommissionItemComponent;
  let fixture: ComponentFixture<CommissionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommissionItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommissionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
