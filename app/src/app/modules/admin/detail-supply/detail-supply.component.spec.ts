import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSupplyComponent } from './detail-supply.component';

describe('DetailSupplyComponent', () => {
  let component: DetailSupplyComponent;
  let fixture: ComponentFixture<DetailSupplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailSupplyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailSupplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
