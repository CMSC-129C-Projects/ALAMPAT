import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditaccountbuyerComponent } from './editaccountbuyer.component';

describe('EditaccountbuyerComponent', () => {
  let component: EditaccountbuyerComponent;
  let fixture: ComponentFixture<EditaccountbuyerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditaccountbuyerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditaccountbuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
