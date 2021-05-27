import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadersellerComponent } from './headerseller.component';

describe('HeadersellerComponent', () => {
  let component: HeadersellerComponent;
  let fixture: ComponentFixture<HeadersellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadersellerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadersellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
