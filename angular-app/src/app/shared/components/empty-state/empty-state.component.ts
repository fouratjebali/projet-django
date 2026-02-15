import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty-state animate-fade-in">
      <div class="empty-icon" *ngIf="icon">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" stroke="var(--color-secondary)" stroke-width="2"/>
          <text 
            x="32" 
            y="42" 
            font-size="32" 
            text-anchor="middle" 
            fill="var(--color-text-tertiary)">
            {{ icon }}
          </text>
        </svg>
      </div>
      <h3 class="empty-title">{{ title }}</h3>
      <p class="empty-message" *ngIf="message">{{ message }}</p>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: var(--space-3xl) var(--space-xl);
      min-height: 300px;
    }

    .empty-icon {
      margin-bottom: var(--space-lg);
      opacity: 0.6;
    }

    .empty-title {
      color: var(--color-text-primary);
      font-size: 1.5rem;
      margin-bottom: var(--space-sm);
    }

    .empty-message {
      color: var(--color-text-secondary);
      max-width: 400px;
      margin-bottom: var(--space-lg);
    }
  `]
})
export class EmptyStateComponent {
  @Input() title: string = 'No data available';
  @Input() message?: string;
  @Input() icon?: string = '📋';
}