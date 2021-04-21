import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderbuyerComponent } from './headerbuyer.component';

describe('HeaderbuyerComponent', () => {
  let component: HeaderbuyerComponent;
  let fixture: ComponentFixture<HeaderbuyerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderbuyerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderbuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
