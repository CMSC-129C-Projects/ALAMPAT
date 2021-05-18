import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewcommissionComponent } from './viewcommission.component';

describe('ViewcommissionComponent', () => {
  let component: ViewcommissionComponent;
  let fixture: ComponentFixture<ViewcommissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewcommissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewcommissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
