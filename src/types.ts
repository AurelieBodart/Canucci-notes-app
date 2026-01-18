export interface Note {
    id: string;
    content: string;
    status: 'pending' | 'approved';
}

export type StatusFilter = 'all' | 'pending' | 'approved';

export const STATUS_FILTER: Record<StatusFilter, StatusFilter> = {
  all: 'all',
  pending: 'pending',
  approved: 'approved',
} as const;