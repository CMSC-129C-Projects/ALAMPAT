import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditaccountsellerComponent } from './editaccountseller.component';

describe('EditaccountsellerComponent', () => {
  let component: EditaccountsellerComponent;
  let fixture: ComponentFixture<EditaccountsellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditaccountsellerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditaccountsellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
