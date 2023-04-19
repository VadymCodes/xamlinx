import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailDemandComponent } from './detail-demand.component';

describe('DetailDemandComponent', () => {
  let component: DetailDemandComponent;
  let fixture: ComponentFixture<DetailDemandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailDemandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailDemandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
