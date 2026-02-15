import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketStatusPanelComponent } from './ticket-status-panel.component';

describe('TicketStatusPanelComponent', () => {
  let component: TicketStatusPanelComponent;
  let fixture: ComponentFixture<TicketStatusPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketStatusPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketStatusPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
