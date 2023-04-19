import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewerExamsComponent } from './exams.component';

describe('ReviewerExamsComponent', () => {
  let component: ReviewerExamsComponent;
  let fixture: ComponentFixture<ReviewerExamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewerExamsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewerExamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
