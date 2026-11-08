export const CycleStatus = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
} as const;

export type CycleStatus = (typeof CycleStatus)[keyof typeof CycleStatus];

export interface WeeklyCycle {
  id: string;
  startDate: string;
  endDate: string;
  status: CycleStatus;
}
