import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessConstantsComponent } from './business-constants.component';

describe('BusinessConstantsComponent', () => {
  let component: BusinessConstantsComponent;
  let fixture: ComponentFixture<BusinessConstantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessConstantsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessConstantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
