import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelTicketDialogComponent } from './cancel-ticket-dialog.component';

describe('CancelTicketDialogComponent', () => {
  let component: CancelTicketDialogComponent;
  let fixture: ComponentFixture<CancelTicketDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelTicketDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelTicketDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
