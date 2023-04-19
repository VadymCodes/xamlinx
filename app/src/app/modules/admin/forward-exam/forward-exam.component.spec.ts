import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForwardExamComponent } from './forward-exam.component';

describe('ForwardExamComponent', () => {
  let component: ForwardExamComponent;
  let fixture: ComponentFixture<ForwardExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForwardExamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForwardExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
