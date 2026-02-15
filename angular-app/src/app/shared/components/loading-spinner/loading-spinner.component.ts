import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-container" [ngClass]="{'full-page': fullPage}">
      <div class="loading-spinner" [style.width.px]="size" [style.height.px]="size"></div>
      <p *ngIf="message" class="loading-message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--space-md);
      padding: var(--space-xl);
    }

    .loading-container.full-page {
      min-height: 60vh;
    }

    .loading-message {
      color: var(--color-text-secondary);
      font-size: 0.875rem;
      margin: 0;
      animation: fadeIn var(--transition-base) ease-out;
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() size: number = 40;
  @Input() message?: string;
  @Input() fullPage: boolean = false;
}