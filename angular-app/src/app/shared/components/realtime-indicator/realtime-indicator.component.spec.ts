import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealtimeIndicatorComponent } from './realtime-indicator.component';

describe('RealtimeIndicatorComponent', () => {
  let component: RealtimeIndicatorComponent;
  let fixture: ComponentFixture<RealtimeIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealtimeIndicatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealtimeIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
