import { Marble } from 'app/marble/marble.model';
import { Sandbox } from '../sandbox.model';
import {
  SINGLE_SEQ_OP_MAP,
  DOUBLE_SEQ_OP_MAP,
  MULTIPLE_SEQ_OP_MAP,
} from './operator-maps';
import { Observable, VirtualTimeScheduler, race } from 'rxjs';
import { bufferTime, endWith } from 'rxjs/operators';

export class Transformer {
  readonly index: number;
  readonly output: Marble[];

  get operatorKey(): string {
    const item = this.sandbox.items[this.index];
    return item.type !== 'transformer' ? '' : item.operatorKey;
  }

  constructor(
    private sandbox: Sandbox,
    private scheduler: VirtualTimeScheduler,
    private previous: Transformer | null = null
  ) {
    this.index = this.findIndex();
    this.output = this.computeOutput();
  }

  private findIndex() {
    const start = this.previous?.index ?? 0;
    for (let n = start + 1; n < this.sandbox.items.length; ++n) {
      if (this.sandbox.items[n].type === 'transformer') {
        return n;
      }
    }
    throw new Error('Transformer not found');
  }

  private computeOutput() {
    const t = this.sandbox.options.marbleEmittingInterval;
    const s = this.scheduler;
    const length = this.sandbox.options.marblesPerSequence;
    const output = [] as Marble[];
    const inputs = this.createInputs();

    inputs.pipe(bufferTime(t, s)).subscribe((x) => {
      const marbles = x;
      if (marbles.length === 0) {
        output.push({ shape: '', color: '' });
      } else {
        output.push(marbles[0]);
      }
    });
    this.scheduler.flush();
    while (output.length < length) {
      output.push({ shape: '', color: '' });
    }
    while (output.length > length) {
      output.pop();
    }
    return output;
  }

  // prettier-ignore
  private createInputs(): Observable<Marble> {
    const t = this.sandbox.options.marbleEmittingInterval;
    const s = this.scheduler;
    const inputs = [] as Observable<Marble>[];
    if (!this.previous) {
      for (let n = 0; n < this.index; ++n) {
        const item = this.sandbox.items[n];
        if (item.type === 'sequence') {
          inputs.push(toScheduledMarbles(item.marbles, t, s));
        }
      }
    } else {
      inputs.push(toScheduledMarbles(this.previous.output, t, s));
      for (let n = this.previous.index; n < this.index; ++n) {
        const item = this.sandbox.items[n];
        if (item.type === 'sequence') {
          inputs.push(toScheduledMarbles(item.marbles, t, s));
        }
      }
    }
    let opMap = MULTIPLE_SEQ_OP_MAP;
    switch (inputs.length) {
      case 1: opMap = SINGLE_SEQ_OP_MAP; break;
      case 2: opMap = DOUBLE_SEQ_OP_MAP; break;
    }
    const op = opMap.get(this.operatorKey);
    return op ? op(s, t, ...inputs) : race(...inputs);
  }
}

function toScheduledMarbles(
  marbles: readonly Marble[],
  marbleEmittingInterval: number,
  scheduler: VirtualTimeScheduler
) {
  let end = marbles.length - 1;
  for (; end >= 0; --end) {
    if (marbles[end].shape) {
      break;
    }
  }
  const seq = marbles.slice(0, end + 1);
  return new Observable<Marble>((subscriber) => {
    const t = marbleEmittingInterval;
    const st = t - 1;
    let n = 0;
    for (; n < seq.length; ++n) {
      if (!seq[n].shape) {
        continue;
      }
      scheduler.schedule(
        (v) => {
          subscriber.next(v);
        },
        st + t * n,
        seq[n]
      );
    }
    scheduler.schedule(() => {
      subscriber.complete();
      subscriber.unsubscribe();
    }, st + t * n);
  }).pipe(endWith());
}
