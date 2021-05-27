import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyaccountsellerComponent } from './myaccountseller.component';

describe('MyaccountsellerComponent', () => {
  let component: MyaccountsellerComponent;
  let fixture: ComponentFixture<MyaccountsellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyaccountsellerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyaccountsellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
