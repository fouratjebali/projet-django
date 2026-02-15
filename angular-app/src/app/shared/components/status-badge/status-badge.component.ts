import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketStatus } from '../../../core/models/clinic.models';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span 
      class="badge animate-fade-in"
      [ngClass]="getBadgeClass()"
      [attr.aria-label]="'Status: ' + getStatusLabel()">
      <svg 
        *ngIf="showIcon" 
        width="12" 
        height="12" 
        viewBox="0 0 12 12" 
        fill="currentColor"
        class="status-icon">
        <circle cx="6" cy="6" r="6"/>
      </svg>
      {{ getStatusLabel() }}
    </span>
  `,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      gap: var(--space-xs);
      transition: all var(--transition-base);
    }

    .status-icon {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .badge-waiting .status-icon,
    .badge-serving .status-icon {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .badge-completed .status-icon,
    .badge-canceled .status-icon,
    .badge-skipped .status-icon {
      animation: none;
    }
  `]
})
export class StatusBadgeComponent {
  @Input() status!: TicketStatus;
  @Input() showIcon: boolean = true;

  getBadgeClass(): string {
    const baseClass = 'badge-';
    switch (this.status) {
      case TicketStatus.WAITING:
        return baseClass + 'waiting';
      case TicketStatus.CALLED:
        return baseClass + 'called';
      case TicketStatus.SERVING:
        return baseClass + 'serving';
      case TicketStatus.COMPLETED:
        return baseClass + 'completed';
      case TicketStatus.SKIPPED:
        return baseClass + 'skipped';
      case TicketStatus.NO_SHOW:
        return baseClass + 'skipped';
      case TicketStatus.CANCELED:
        return baseClass + 'canceled';
      default:
        return baseClass + 'waiting';
    }
  }

  getStatusLabel(): string {
    switch (this.status) {
      case TicketStatus.WAITING:
        return 'Waiting';
      case TicketStatus.CALLED:
        return 'Called';
      case TicketStatus.SERVING:
        return 'Being Served';
      case TicketStatus.COMPLETED:
        return 'Completed';
      case TicketStatus.SKIPPED:
        return 'Skipped';
      case TicketStatus.NO_SHOW:
        return 'No Show';
      case TicketStatus.CANCELED:
        return 'Canceled';
      default:
        return 'Unknown';
    }
  }
}