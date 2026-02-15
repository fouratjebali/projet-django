import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueMiniStatsComponent } from './queue-mini-stats.component';

describe('QueueMiniStatsComponent', () => {
  let component: QueueMiniStatsComponent;
  let fixture: ComponentFixture<QueueMiniStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueueMiniStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueueMiniStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
