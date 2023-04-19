import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolExtensionsComponent } from './school-extensions.component';

describe('SchoolExtensionsComponent', () => {
  let component: SchoolExtensionsComponent;
  let fixture: ComponentFixture<SchoolExtensionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolExtensionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolExtensionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
