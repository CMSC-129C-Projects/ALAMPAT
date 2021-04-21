import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellershopComponent } from './sellershop.component';

describe('SellershopComponent', () => {
  let component: SellershopComponent;
  let fixture: ComponentFixture<SellershopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellershopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellershopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
