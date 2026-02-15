import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinQueuePageComponent } from './join-queue-page.component';

describe('JoinQueuePageComponent', () => {
  let component: JoinQueuePageComponent;
  let fixture: ComponentFixture<JoinQueuePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinQueuePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
