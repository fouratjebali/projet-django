import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, finalize } from 'rxjs';
import { ClinicApiService } from '../../../core/services/clinic-api.service';
import { Clinic, Service, QueueStats } from '../../../core/models/clinic.models';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-join-queue',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingSpinnerComponent],
  templateUrl: './join-queue.component.html',
  styleUrls: ['./join-queue.component.scss']
})
export class JoinQueueComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  clinic: Clinic | null = null;
  services: Service[] = [];
  queueStats: QueueStats | null = null;
  joinForm: FormGroup;
  
  loading = true;
  submitting = false;
  error: string | null = null;
  clinicSlug: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private clinicApi: ClinicApiService
  ) {
    this.joinForm = this.fb.group({
      patientName: ['', [Validators.required, Validators.minLength(2)]],
      patientPhone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-()]+$/)]],
      serviceId: ['', Validators.required],
      note: ['', Validators.maxLength(500)]
    });
  }

  ngOnInit(): void {
    this.clinicSlug = this.route.snapshot.paramMap.get('slug') || '';
    this.loadClinicData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadClinicData(): void {
    this.loading = true;
    this.error = null;

    this.clinicApi.getClinicBySlug(this.clinicSlug)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (clinic) => {
          this.clinic = clinic;
          if (!clinic.isOpen) {
            this.error = 'This clinic is currently closed. Please check back during business hours.';
            return;
          }
          this.loadServices(clinic.id);
          this.loadQueueStats(clinic.id);
        },
        error: (err) => {
          this.error = err.message || 'Failed to load clinic information.';
        }
      });
  }

  loadServices(clinicId: string): void {
    this.clinicApi.getServices(clinicId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (services) => {
          this.services = services;
          if (services.length === 1) {
            this.joinForm.patchValue({ serviceId: services[0].id });
          }
        },
        error: (err) => {
          console.error('Failed to load services:', err);
        }
      });
  }

  loadQueueStats(clinicId: string): void {
    this.clinicApi.getQueueStats(clinicId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          this.queueStats = stats;
        },
        error: (err) => {
          console.error('Failed to load queue stats:', err);
        }
      });
  }

  onSubmit(): void {
    if (this.joinForm.invalid || !this.clinic) {
      this.markFormGroupTouched(this.joinForm);
      return;
    }

    this.submitting = true;
    this.error = null;

    this.clinicApi.joinQueue(this.clinic.id, this.joinForm.value)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.submitting = false)
      )
      .subscribe({
        next: (response) => {
          // Navigate to ticket status page
          this.router.navigate(['/ticket', response.publicToken]);
        },
        error: (err) => {
          this.error = err.message || 'Failed to join the queue. Please try again.';
        }
      });
  }

  getFieldError(fieldName: string): string | null {
    const field = this.joinForm.get(fieldName);
    if (!field || !field.touched || !field.errors) {
      return null;
    }

    if (field.errors['required']) {
      return 'This field is required';
    }
    if (field.errors['minlength']) {
      return `Minimum length is ${field.errors['minlength'].requiredLength}`;
    }
    if (field.errors['pattern']) {
      return 'Please enter a valid phone number';
    }
    if (field.errors['maxlength']) {
      return `Maximum length is ${field.errors['maxlength'].requiredLength}`;
    }

    return null;
  }

  hasFieldError(fieldName: string): boolean {
    return this.getFieldError(fieldName) !== null;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  callClinic(): void {
    if (this.clinic?.phone) {
      window.location.href = `tel:${this.clinic.phone}`;
    }
  }

  trackTicket(): void {
    this.router.navigate(['/track']);
  }
}