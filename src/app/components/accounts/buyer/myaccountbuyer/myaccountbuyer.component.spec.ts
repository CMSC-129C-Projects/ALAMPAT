import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyaccountbuyerComponent } from './myaccountbuyer.component';

describe('MyaccountbuyerComponent', () => {
  let component: MyaccountbuyerComponent;
  let fixture: ComponentFixture<MyaccountbuyerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyaccountbuyerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyaccountbuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
