import { Marble } from '../marble/marble.model';

export type SandboxOptions = {
  [key: string]: unknown;
  readonly marblesPerSequence: number;
  readonly marbleEmittingInterval: number;
  readonly maxItemCount: number;
  readonly goalMarbles: readonly Marble[];
};
