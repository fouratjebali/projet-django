import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueStatusChipComponent } from './queue-status-chip.component';

describe('QueueStatusChipComponent', () => {
  let component: QueueStatusChipComponent;
  let fixture: ComponentFixture<QueueStatusChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueueStatusChipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueueStatusChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
