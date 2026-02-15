import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Ticket, TicketStatus } from '../models/clinic.models';

export interface SocketStatus {
  connected: boolean;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: Socket | null = null;
  private statusSubject = new BehaviorSubject<SocketStatus>({ connected: false });
  private ticketUpdateSubject = new Subject<Ticket>();
  private queueUpdateSubject = new Subject<void>();

  public status$ = this.statusSubject.asObservable();
  public ticketUpdate$ = this.ticketUpdateSubject.asObservable();
  public queueUpdate$ = this.queueUpdateSubject.asObservable();

  constructor() {}

  /**
   * Connect to WebSocket server
   */
  connect(url: string = 'http://localhost:3000'): void {
    if (this.socket?.connected) {
      console.log('WebSocket already connected');
      return;
    }

    this.socket = io(url, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    this.setupSocketListeners();
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.statusSubject.next({ connected: false });
    }
  }

  /**
   * Subscribe to ticket updates
   */
  subscribeToTicket(publicToken: string): void {
    if (this.socket?.connected) {
      this.socket.emit('subscribe:ticket', { publicToken });
      console.log('Subscribed to ticket:', publicToken);
    }
  }

  /**
   * Unsubscribe from ticket updates
   */
  unsubscribeFromTicket(publicToken: string): void {
    if (this.socket?.connected) {
      this.socket.emit('unsubscribe:ticket', { publicToken });
      console.log('Unsubscribed from ticket:', publicToken);
    }
  }

  /**
   * Subscribe to clinic queue updates
   */
  subscribeToQueue(clinicId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('subscribe:queue', { clinicId });
      console.log('Subscribed to queue:', clinicId);
    }
  }

  /**
   * Unsubscribe from clinic queue updates
   */
  unsubscribeFromQueue(clinicId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('unsubscribe:queue', { clinicId });
      console.log('Unsubscribed from queue:', clinicId);
    }
  }

  /**
   * Setup socket event listeners
   */
  private setupSocketListeners(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.statusSubject.next({ connected: true });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      this.statusSubject.next({ connected: false });
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.statusSubject.next({ 
        connected: false, 
        error: error.message 
      });
    });

    // Ticket updates
    this.socket.on('ticket:updated', (data: { ticket: Ticket }) => {
      console.log('Ticket updated:', data.ticket);
      this.ticketUpdateSubject.next(data.ticket);
    });

    // Queue updates
    this.socket.on('queue:updated', (data: { clinicId: string }) => {
      console.log('Queue updated for clinic:', data.clinicId);
      this.queueUpdateSubject.next();
    });

    // Ticket status changes
    this.socket.on('ticket:status-changed', (data: { 
      ticketId: string;
      status: TicketStatus;
      ticket: Ticket;
    }) => {
      console.log('Ticket status changed:', data);
      this.ticketUpdateSubject.next(data.ticket);
    });
  }

  /**
   * Get current connection status
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Manually emit an event (for custom use cases)
   */
  emit(event: string, data: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Cannot emit - WebSocket not connected');
    }
  }

  /**
   * Listen to a custom event
   */
  on(event: string): Observable<any> {
    const subject = new Subject<any>();
    
    if (this.socket) {
      this.socket.on(event, (data: any) => {
        subject.next(data);
      });
    }
    
    return subject.asObservable();
  }
}