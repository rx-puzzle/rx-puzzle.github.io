import { Marble } from '../marble/marble.model';

export type SandboxItem =
  | {
      readonly type: 'sequence';
      readonly id: string;
      readonly marbles: readonly Marble[];
    }
  | {
      readonly type: 'transformer';
      readonly id: string;
      readonly operatorKey: string;
    };
