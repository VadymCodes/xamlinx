import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailReviewerComponent } from './detail-reviewer.component';

describe('DetailReviewerComponent', () => {
  let component: DetailReviewerComponent;
  let fixture: ComponentFixture<DetailReviewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailReviewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailReviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
