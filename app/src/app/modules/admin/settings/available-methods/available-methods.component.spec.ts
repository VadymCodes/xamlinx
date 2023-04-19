import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableMethodsComponent } from './available-methods.component';

describe('AvailableMethodsComponent', () => {
  let component: AvailableMethodsComponent;
  let fixture: ComponentFixture<AvailableMethodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvailableMethodsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
