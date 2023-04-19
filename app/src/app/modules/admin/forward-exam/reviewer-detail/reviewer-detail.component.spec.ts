import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewerDetailComponent } from './reviewer-detail.component';

describe('ReviewerDetailComponent', () => {
  let component: ReviewerDetailComponent;
  let fixture: ComponentFixture<ReviewerDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewerDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
