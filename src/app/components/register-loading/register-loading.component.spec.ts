import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterLoadingComponent } from './register-loading.component';

describe('RegisterLoadingComponent', () => {
  let component: RegisterLoadingComponent;
  let fixture: ComponentFixture<RegisterLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterLoadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
