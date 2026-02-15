import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { 
  Clinic, 
  Service, 
  QueueStats, 
  JoinQueueRequest, 
  JoinQueueResponse,
  TicketStatusResponse,
  Ticket 
} from '../models/clinic.models';

@Injectable({
  providedIn: 'root'
})
export class ClinicApiService {
  private readonly apiUrl = '/api'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  /**
   * Get clinic information by slug
   */
  getClinicBySlug(slug: string): Observable<Clinic> {
    return this.http.get<Clinic>(`${this.apiUrl}/clinics/${slug}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get queue statistics for a clinic
   */
  getQueueStats(clinicId: string): Observable<QueueStats> {
    return this.http.get<QueueStats>(`${this.apiUrl}/clinics/${clinicId}/queue/stats`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get available services for a clinic
   */
  getServices(clinicId: string): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.apiUrl}/clinics/${clinicId}/services`)
      .pipe(
        map(services => services.filter(s => s.isActive)),
        catchError(this.handleError)
      );
  }

  /**
   * Join the queue - create a new ticket
   */
  joinQueue(clinicId: string, request: JoinQueueRequest): Observable<JoinQueueResponse> {
    return this.http.post<JoinQueueResponse>(
      `${this.apiUrl}/clinics/${clinicId}/queue/join`, 
      request
    ).pipe(catchError(this.handleError));
  }

  /**
   * Get ticket status by public token
   */
  getTicketStatus(publicToken: string): Observable<TicketStatusResponse> {
    return this.http.get<TicketStatusResponse>(
      `${this.apiUrl}/tickets/${publicToken}`
    ).pipe(catchError(this.handleError));
  }

  /**
   * Cancel a ticket
   */
  cancelTicket(publicToken: string): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/tickets/${publicToken}/cancel`,
      {}
    ).pipe(catchError(this.handleError));
  }

  /**
   * Find ticket by phone number
   */
  findTicketByPhone(phone: string): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(
      `${this.apiUrl}/tickets/search`,
      { params: { phone } }
    ).pipe(catchError(this.handleError));
  }

  /**
   * Find ticket by code
   */
  findTicketByCode(code: string, phone: string): Observable<Ticket | null> {
    return this.http.get<Ticket[]>(
      `${this.apiUrl}/tickets/search`,
      { params: { code, phone } }
    ).pipe(
      map(tickets => tickets.length > 0 ? tickets[0] : null),
      catchError(this.handleError)
    );
  }

  /**
   * Error handler
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Error: ${error.status}`;
    }

    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}