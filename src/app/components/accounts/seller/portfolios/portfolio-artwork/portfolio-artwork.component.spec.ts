import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioArtworkComponent } from './portfolio-artwork.component';

describe('PortfolioArtworkComponent', () => {
  let component: PortfolioArtworkComponent;
  let fixture: ComponentFixture<PortfolioArtworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortfolioArtworkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioArtworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
