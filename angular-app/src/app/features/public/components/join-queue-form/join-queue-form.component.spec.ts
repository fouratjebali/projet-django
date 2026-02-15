import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinQueueFormComponent } from './join-queue-form.component';

describe('JoinQueueFormComponent', () => {
  let component: JoinQueueFormComponent;
  let fixture: ComponentFixture<JoinQueueFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinQueueFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinQueueFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
