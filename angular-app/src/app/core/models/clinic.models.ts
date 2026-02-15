export interface Clinic {
  id: string;
  slug: string;
  name: string;
  logo?: string;
  phone?: string;
  email?: string;
  address?: string;
  isOpen: boolean;
  openHours?: {
    day: string;
    open: string;
    close: string;
  }[];
}

export interface Service {
  id: string;
  name: string;
  avgDurationMinutes: number;
  isActive: boolean;
}

export enum TicketStatus {
  WAITING = 'waiting',
  CALLED = 'called',
  SERVING = 'serving',
  COMPLETED = 'completed',
  SKIPPED = 'skipped',
  NO_SHOW = 'no_show',
  CANCELED = 'canceled'
}

export interface Ticket {
  id: string;
  code: string;
  publicToken: string;
  clinicId: string;
  serviceId: string;
  patientName: string;
  patientPhone: string;
  note?: string;
  status: TicketStatus;
  position?: number;
  estimatedWaitMinutes?: number;
  joinedAt: Date;
  calledAt?: Date;
  servingAt?: Date;
  completedAt?: Date;
  canceledAt?: Date;
}

export interface QueueStats {
  waitingCount: number;
  currentlyServing: number;
  averageWaitMinutes: number;
}

export interface JoinQueueRequest {
  patientName: string;
  patientPhone: string;
  serviceId: string;
  note?: string;
}

export interface JoinQueueResponse {
  ticket: Ticket;
  publicToken: string;
}

export interface TicketStatusResponse {
  ticket: Ticket;
  position: number;
  estimatedWaitMinutes: number;
  currentlyServing?: string;
}